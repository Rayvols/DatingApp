using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentiones;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository, IMapper mapper,
        IPhotoService photoService)
        {
            _photoService = photoService;
            _userRepository = userRepository;
            _mapper = mapper;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();

            return Ok(users);
        }

        [HttpGet("{username}")]

        public async Task<ActionResult<MemberDto>> GetUsers(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]

        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Ошибка обновления");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                // return _mapper.Map<PhotoDto>(photo);
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));

            }

            return BadRequest("Проблема загрузки фото");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("Это фото уже основное");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Ошибка установки фото");

        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletPhoto(int photoId){
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x=> x.Id == photoId);

            if(photo == null) return NotFound();

            if(photo.IsMain) return BadRequest("Вы  не можете удалить главное фото");

            if(photo.PublicId != null)
            
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

                if(await _userRepository.SaveAllAsync()) return Ok();// почему если добавить сообщение ошибка?

                return BadRequest("Ошибка удления фото");
        }

    }
}