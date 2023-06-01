import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Prompt } from "../models/prompt";
import { RcFile } from "antd/es/upload";
import { DalleParameters } from "../models/dalleParameters";
import { ChatTest } from "../models/chatTest";

export default class aiStore {
    constructor() {
        makeAutoObservable(this)
    }

    chatGpt = async (prompt: ChatTest[]) => {
        try {
            const response = await agent.ml.chatGptPrompt(prompt);
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
}
