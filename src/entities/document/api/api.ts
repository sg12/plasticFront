import { supabase } from "@/shared/api/supabase/client";
import type { DoctorUploadedFiles, ClinicUploadedFiles } from "../types/types";

const STORAGE_BUCKET = "documents";

type UploadedFilePaths = {
  [key: string]: string | string[];
};


export async function uploadFiles(
  userId: string,
  role: "doctor" | "clinic",
  files: DoctorUploadedFiles | ClinicUploadedFiles
): Promise<UploadedFilePaths> {
  const paths: UploadedFilePaths = {};

  for (const [key, fileOrFiles] of Object.entries(files)) {
    if (!fileOrFiles) continue;

    const filesArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

    const uploadedPaths: string[] = [];

    for (const file of filesArray) {
      if (!(file instanceof File)) continue;

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${userId}/${role}/${key}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error(`Ошибка загрузки файла ${key}:`, uploadError);
        throw new Error(`Не удалось загрузить файл ${key}: ${uploadError.message}`);
      }

      uploadedPaths.push(filePath);
    }

    if (uploadedPaths.length > 0) {
      paths[key] = Array.isArray(fileOrFiles) ? uploadedPaths : uploadedPaths[0];
    }
  }

  return paths;
}

export async function getFileUrls(
  filePaths: UploadedFilePaths
): Promise<Array<{ name: string; url: string }>> {
  const urls: Array<{ name: string; url: string }> = [];

  for (const [key, pathOrPaths] of Object.entries(filePaths)) {
    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];

    for (const path of paths) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(path, 3600); // URL действителен 1 час

      if (error) {
        console.error(`Ошибка получения URL для ${path}:`, error);
        continue;
      }

      if (data?.signedUrl) {
        urls.push({
          name: key,
          url: data.signedUrl,
        });
      }
    }
  }

  return urls;
}
