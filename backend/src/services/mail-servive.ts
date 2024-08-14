import nodemailer from "nodemailer";

class MailService {
  private transporter;

  public constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "lehkiyshectkiy@gmail.com",
        pass: "bpnl zlpq tqrn nonn",
      },
    });
  }

  public async sendMail(to : string,subject : string,data : string){
    const mailOptions = {
        from: "lehkiyshectkiy@gmail.com",
        to,
        subject: subject,
        text: "",
        html: data,
      };

      const info = await this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("oops something went wrong during sendmaul");
          
        } else {
            console.log("everything went good during sendmaul");
        }
      });
  }
}

const mailService = new MailService();


export default mailService;