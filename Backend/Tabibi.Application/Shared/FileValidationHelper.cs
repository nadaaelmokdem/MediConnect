using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Tabibi.Application.DTOs;

namespace Tabibi.Application.Shared
{
    public static class FileValidationHelper
    {
        private static readonly HashSet<string> AllowedImageMimeTypes =
            new(StringComparer.OrdinalIgnoreCase)
            { "image/jpeg", "image/png", "image/gif", "image/webp" };

        private static readonly HashSet<string> AllowedDocumentMimeTypes =
            new(StringComparer.OrdinalIgnoreCase)
            { "image/jpeg", "image/png", "image/webp", "application/pdf" };

        private const long MaxImageBytes    = 5  * 1024 * 1024; // 5 MB
        private const long MaxDocumentBytes = 10 * 1024 * 1024; // 10 MB

        public static ServiceResult ValidateImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return ServiceResult.Failure("File is empty or not provided.");

            if (file.Length > MaxImageBytes)
                return ServiceResult.Failure("File size must not exceed 5 MB.");

            if (!AllowedImageMimeTypes.Contains(file.ContentType))
                return ServiceResult.Failure("Only JPEG, PNG, GIF, and WebP images are allowed.");

            return ServiceResult.Success();
        }

        public static ServiceResult ValidateDocument(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return ServiceResult.Failure("File is empty or not provided.");

            if (file.Length > MaxDocumentBytes)
                return ServiceResult.Failure("File size must not exceed 10 MB.");

            if (!AllowedDocumentMimeTypes.Contains(file.ContentType))
                return ServiceResult.Failure("Only JPEG, PNG, WebP, and PDF files are allowed.");

            return ServiceResult.Success();
        }
    }
}
