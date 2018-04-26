//@flow
import EventEmitter from "events";

class WebSDK extends EventEmitter {
    baseUrl: string;
    clientId: string;
    secretId: string;
    refreshRateMs: number;
    timeOutTicket: any;

    constructor(configData : {
        baseUrl: string,
        clientId: string,
        secretId: string,
        refreshRateMs?: number
    }) {
        super();

        const { baseUrl, clientId, secretId, refreshRateMs } = configData || {};

        if (!baseUrl || !clientId || !secretId)
            throw new Error('Missing critical config paramaters');

        this.baseUrl = baseUrl;
        this.clientId = clientId;
        this.secretId = secretId;
        this.refreshRateMs = refreshRateMs || 5000
    }

    async generateSSOData() {
        const { baseUrl, clientId, secretId } = this;
        try {
            const response = await this._fetchAsync(`${baseUrl}/api/v0.3/service/register/${clientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_secret: secretId
                })
            })

            this.emit('code-refresh', response)

            // Start watching for status
            this._waitingLoginComplete(response.session)

            return response;

        } catch (err) {
            throw err;
        }
    }

    async _waitingLoginComplete(sessionId:string) : any{
        if (this.timeOutTicket) {
            clearInterval(this.timeOutTicket);
            this.timeOutTicket = null;
        }

        this.timeOutTicket = setInterval(async _ => {
            const response = await this._refreshSessionTicket(sessionId);
            
            if (!response)
                return;

            const { status } = response;

            if (status === 'success' || status === 'failed') {
                this.emit('sso-complete', response)
                clearInterval(this.timeOutTicket);
                this.timeOutTicket = null;
            } else if (status === 'processing')
                this.emit('sso-processing', response)

        }, this.refreshRateMs)
    }

    async _refreshSessionTicket(sessionId:string) : any{
        const { baseUrl } = this;
        const response = await this._fetchAsync(`${baseUrl}/api/v0.3/service/register/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('refresh', sessionId, response)
        return response;
    }

    async _fetchAsync(url:string, configs:Object) : Promise<any>{
        const response = await fetch(url, configs);
        if (response.ok)
            return await response.json()
    }
}

export default WebSDK