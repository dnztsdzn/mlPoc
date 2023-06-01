export interface ChatTest {
    user: string;
    prompt: string;
}

export interface ChatTestFormValues {
    user: string;
    prompt: string;
}

export class ChatTestFormValues{
    user: string = '';
    prompt: string ='';

    constructor(chatTest?: ChatTestFormValues){
        if(chatTest){
            this.prompt=chatTest.prompt;
            this.user=chatTest.user;
        }
    }
}