using Microsoft.AspNetCore.Http;

namespace Tabibi.Application.Interfaces;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file, string folderPrefix = "");
    Task DeleteFileAsync(string fileUrl);
    Task<byte[]> GetFileBytesAsync(string objectKey);
    Task<Stream> GetFileStreamAsync(string objectKey);
    string GetPresignedUrl(string objectKey, TimeSpan expiration);
}
