import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

export class HelloTelegram implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HelloTelegram',
		name: 'helloTelegram',
		group: ['transform'],
		version: 1,
		description: 'Adds Hello before every message that is send to the bot',
		defaults: {
			name: 'Hello Telegram',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'helloTelegramApi',
				required: true,
			},
		],
		// operation: send message
		// ressource: message
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'number',
				default: 0,
				placeholder: 'chat id',
				description: 'chat id',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				placeholder: 'My message',
				description: 'Text',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// TODO use tocken from the credentials in the request

		let item: INodeExecutionData;
		const textInput = this.getNodeParameter('text', 0) as string;
		const chatId = this.getNodeParameter('chatId', 0) as number;
		const credentials = await this.getCredentials('helloTelegramApi');
		const token = credentials.token;

		let responseData;
		const returnData = [];

		item = items[0];

		item.json['chatId'] = chatId
		item.json['textInput'] = textInput

		const telegramUri = `https://api.telegram.org/bot${token}/sendMessage`

		// make api call to send message to telegram
		const options: OptionsWithUri = {
			headers: {
				'Accept': 'application/json',
			},
			method: 'POST',
			body: {
				chat_id: chatId,
				text: `Hello ${textInput}`,
			},
			uri: telegramUri,
			json: true,
		};
		responseData = await this.helpers.request.call(this, options);
		returnData.push(responseData);
		
		return [this.helpers.returnJsonArray(returnData)];
	}
}
