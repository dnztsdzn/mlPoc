import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Prompt } from "../models/prompt";
import { RcFile } from "antd/es/upload";
import { DalleParameters } from "../models/dalleParameters";
import { ChatTest } from "../models/chatTest";
import { FineTuneTest } from "../models/fineTuneModel";
import { CompletionParametersModel } from "../models/completionParametersModel";

export default class aiStore {
    constructor() {
        makeAutoObservable(this)
    }

    chatGpt = async (chatTest:ChatTest[]) => {
        try {
            const response = await agent.ml.chatGptPrompt(chatTest);
            return response;
            // const user = await agent.Account.login(creds);
            // store.commonStore.setToken(user.token);
            // runInAction(() => this.user = user);
            // router.navigate('/activities');
            // store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }
    completionParameters = async (completionParameters:CompletionParametersModel) => {
        try {
            const response = await agent.ml.completionOpenai(completionParameters);
            return response;
            // const user = await agent.Account.login(creds);
            // store.commonStore.setToken(user.token);
            // runInAction(() => this.user = user);
            // router.navigate('/activities');
            // store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    deleteUploadedFile = async (fileId: Prompt) => {
        try {
            const response = await agent.ml.deleteFile(fileId);
            return response;
            // const user = await agent.Account.login(creds);
            // store.commonStore.setToken(user.token);
            // runInAction(() => this.user = user);
            // router.navigate('/activities');
            // store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }
    fineTuneTraining = async (finetunetraining: Prompt) => {
        try {
            const response = await agent.ml.fineTuneTraining(finetunetraining);
            return response;
            // const user = await agent.Account.login(creds);
            // store.commonStore.setToken(user.token);
            // runInAction(() => this.user = user);
            // router.navigate('/activities');
            // store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    dalleImage = async (dalleParameters: DalleParameters) => {
        try {
            const response = await agent.ml.dalleImage(dalleParameters);
            return response;
            // const user = await agent.Account.login(creds);
            // store.commonStore.setToken(user.token);
            // runInAction(() => this.user = user);
            // router.navigate('/activities');
            // store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    whisperTranscribeTest = async (file: any,transcribeOrTranslate:string) => {
        try {
            
            const response = await agent.ml.whisperAudio(file,transcribeOrTranslate);
            return response;

        } catch (error) {
            throw error;
        }
    }

    uploadFile = async (file: any,purpose:string) => {
        try {
            
            const response = await agent.ml.uploadFile(file,purpose);
            return response;

        } catch (error) {
            throw error;
        }
    }
    getFileList = async () => {
        try {
            
            const response = await agent.ml.getListFiles();
            return response;

        } catch (error) {
            throw error;
        }
    }
    fineTunedModelsList = async () => {
        try {
            
            const response = await agent.ml.getFineTunedModelsList();
            return response;

        } catch (error) {
            throw error;
        }
    }
}
