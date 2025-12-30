import {
  DocumentPickerAsset,
  DocumentPickerOptions,
  DocumentPickerResult,
  DocumentPickerSuccessResult,
  getDocumentAsync,
} from 'expo-document-picker';
import {
  ImagePickerAsset,
  ImagePickerOptions,
  ImagePickerSuccessResult,
  launchImageLibraryAsync,
} from 'expo-image-picker';
import { Platform } from 'react-native';
import CharUtils from './char-utils';

// This function is used to get the document async from the web.
// If you are only developing for native, you can remove this function.
function getDocumentAsyncWeb({
  type = '*/*',
  multiple = false,
}: DocumentPickerOptions = {}): Promise<DocumentPickerResult> {
  const input = document.createElement('input');
  input.style.display = 'none';
  input.setAttribute('type', 'file');
  input.setAttribute('accept', Array.isArray(type) ? type.join(',') : type);
  input.setAttribute('id', String(Math.random()));
  if (multiple) {
    input.setAttribute('multiple', 'multiple');
  }

  document.body.appendChild(input);

  return new Promise((resolve, reject) => {
    input.addEventListener('change', async () => {
      if (input.files) {
        const results: Promise<DocumentPickerAsset>[] = [];
        for (const file of Array.from(input.files ?? [])) {
          results.push(readFileAsync(file));
        }
        try {
          const assets = await Promise.all(results);
          resolve({ canceled: false, assets, output: input.files });
        } catch (e) {
          reject(e);
        }
      } else {
        resolve({ canceled: true, assets: null });
      }

      document.body.removeChild(input);
    });

    input.addEventListener('cancel', () => {
      resolve({ canceled: true, assets: null });
    });

    const event = new MouseEvent('click');
    input.dispatchEvent(event);
  });
}

function readFileAsync(targetFile: File): Promise<DocumentPickerAsset> {
  const mimeType = targetFile.type;
  return new Promise((resolve, reject) => {
    if (mimeType?.includes('video/')) {
      resolve({
        uri: '',
        mimeType,
        name: targetFile.name,
        lastModified: targetFile.lastModified,
        size: targetFile.size,
        file: targetFile,
      });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      reject(
        new Error(
          `Failed to read the selected media because the operation failed.`
        )
      );
    };
    reader.onload = ({ target }) => {
      const uri = (target as any).result;
      resolve({
        uri,
        mimeType,
        name: targetFile.name,
        lastModified: targetFile.lastModified,
        size: targetFile.size,
        file: targetFile,
      });
    };

    // Read in the image file as a binary string.
    reader.readAsDataURL(targetFile);
  });
}

abstract class FilePickerUtils {
  static async pickFiles(
    onPick: (result: DocumentPickerSuccessResult) => void,
    options?: DocumentPickerOptions
  ) {
    try {
      const result = await (Platform.OS === 'web'
        ? getDocumentAsyncWeb(options)
        : getDocumentAsync(options));

      if (!result.canceled) {
        onPick(result);
      }
    } catch (error) {
      console.error('Woii', error);
    }
  }

  static async pickPhotosAndVideos(
    onPick: (result: ImagePickerSuccessResult) => void,
    options?: ImagePickerOptions
  ) {
    const result = await launchImageLibraryAsync(options);

    if (!result.canceled) {
      onPick(result);
    }
  }

  static assetToFormData(
    asset: DocumentPickerAsset | ImagePickerAsset | File,
    formDataName: string
  ) {
    const formData = new FormData();

    const assetPayload =
      asset instanceof File
        ? asset
        : {
            uri: asset.uri,
            name: CharUtils.normalize(
              'name' in asset ? asset.name : asset.uri.split('/').pop() ?? ''
            ),
            type:
              'mimeType' in asset
                ? asset.mimeType ?? ''
                : 'type' in asset
                ? asset.type
                : '',
            size:
              'size' in asset
                ? asset.size
                : 'fileSize' in asset
                ? asset.fileSize
                : 0,
          };

    formData.append(
      formDataName,
      (Platform.OS === 'web'
        ? asset instanceof File
          ? asset
          : (asset as DocumentPickerAsset).file
        : assetPayload) as unknown as File
    );

    return formData;
  }

  static async fileToBase64(file: File) {
    if (!file) return '';
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static async base64ToFile(
    dataUrl: string,
    fileName: string,
    fileType: string
  ) {
    if (Platform.OS !== 'web') return undefined;
    var imageContent = atob(dataUrl);

    var buffer = new ArrayBuffer(imageContent.length);
    var view = new Uint8Array(buffer);

    for (var n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }

    return new File([buffer], fileName, { type: fileType });
  }
}

export default FilePickerUtils;
