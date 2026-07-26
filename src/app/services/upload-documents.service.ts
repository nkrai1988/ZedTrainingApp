import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

@Injectable({ providedIn: 'root' })
export class UploadDocumentsService {
  constructor(private api: ApiService) {}

  uploadDocument(file: File, metadata: {
    documentTitle: string;
    documentType: string;
    orgCategoryId: number;
    orgSubCategoryId: number;
    programmeType: string;
  }) {
    return this.api.postWithFile(APPURLs.documentUpload, metadata, file, 'file');
  }

  getDocuments(categoryId?: number, subCategoryId?: number, programmeType?: string) {
    let query = '?';
    if (categoryId) query += `categoryId=${categoryId}&`;
    if (subCategoryId) query += `subCategoryId=${subCategoryId}&`;
    if (programmeType && programmeType !== 'All') query += `programmeType=${encodeURIComponent(programmeType)}`;
    return this.api.getSimple(APPURLs.documentList + query);
  }

  updateDocument(id: number, metadata: {
    documentTitle: string;
    documentType: string;
    orgCategoryId: number;
    orgSubCategoryId: number;
    programmeType: string;
  }) {
    return this.api.putSimple(`${APPURLs.documentUpdate}/${id}`, metadata);
  }

  deleteDocument(id: number) {
    return this.api.delete(`${APPURLs.documentDelete}/${id}`);
  }
}
