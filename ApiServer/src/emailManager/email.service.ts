import { Injectable, Inject } from '@nestjs/common';
import { Modules } from 'src/app.constants';
var request = require("request");

@Injectable()
export class EmailService {
  constructor(
    @Inject(Modules.Logger) logger)
  {
  }

  async sendMail(address: string, feedback: string, browser: string, type: string, networkId: number){
    let networkName = "";
    if(networkId == 1){
      networkName = "Mainnet"
    }else if(networkId == 5){
      networkName = 'Goerli'
    }else if(networkId == 4){
      networkName = 'Rinkeby'
    }else if(networkId == 42){
      networkName = 'Kovan'
    }else if(networkId == 3){
      networkName = 'Ropsten'
    }else{
      networkName = 'Unknown'
    }
    var options = { method: 'POST',
      url: `${process.env.EMAIL_ENDPOINT}/smtp/email`,
      body:
      { tags: [ 'feedback' ],
        sender: { name: 'Gather', email: 'hello@protea.io' },
        to: [ { email: 'hello@protea.io' }],
        subject: `Feedback - ${address} - ${networkName} - ${type}`,
        textContent: feedback,
        replyTo: { email: 'hello@protea.io' } },
      json: true,
      headers:{
        'api-key': process.env.EMAIL_API_KEY
      }
     };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      return true
    });
  }
}
