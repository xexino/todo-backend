
const { APP } = require("../app");
const { db } = require("../config/mysql");
const { Creedantials } = require("../model/cridantals");
const { UserModal } = require("../model/user");
const randomString = require('randomstring');
const { transport } = require("../mailer/mailer");
const bcrypt = require('bcrypt');


async function CompairePassword(password, password_hash) {

    try {
        return result = await bcrypt.compare(password, password_hash);

    } catch (error) {
        console.log(error)
    }

}

CompairePassword("Pass1as234"); // test the async function
// register user



exports.register = (req, resp) => {


    //new object  Fetch data from req
    let newUser = new UserModal(
        req.body.Firstname,
        req.body.Lastname,
        req.body.Username,
        req.body.Avatar_Url,
        req.body.Password)

    //VALIDATE DATAs

    let { password, username, lastname } = newUser

    var passwordPatern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;

    if (!passwordPatern.test(password)) {

        resp.send(" <h1 style =' color : blue' > " + "password should be at least 8  and  max 12")

        return
    }

    let usernamePattern = /^.{4,30}$/

    if (!usernamePattern.test(username)) {
        resp.send(" <h1 style =' color : red' > " + "username should be at least 4  and  max 12 </h1>")
        return
    }
    if (newUser.lastname.length < 4 || newUser.lastname.length > 12) {
        resp.send(" <h1 style =' color : orange' > " + "lastname should be at least 8  and  max 12 </h1>")
        return
    }

    db.query(`
               SELECT * FROM USERS 
               WHERE username = '${newUser.username}'
            `, (err, resQ) => {
        if (err) throw err
        else {
            console.log(resQ)
            if (resQ.length > 0) {
                //verifier if the username is alread used

                resp.send(" <h1 style =' color : red'>   " + newUser.username + "   Alredy exist")
            }
            else {
                //Create sql table for the new user

                let query = `INSERT INTO USERS SET ?`

                //generate Token for the user 

                newUser.setMailToken(randomString.generate())

                // Hashage du password

                const password_hash = bcrypt.hashSync(password, 10);

                console.log(password_hash);

                const mailOptions = {
                    from: "todoApp@gmc.com",
                    to: newUser.username,
                    subject: "Please Verify your email Account",
                    html: `
                    <h1>This mail will expire in 24 hour</h1>
                    <a href="http://localhost:9000/api/auth/verify/${newUser.username}/code/${newUser.emailToken}">Verify My Email</a>`
                }
                transport.sendMail(mailOptions, (err, info) => {
                    if (err) throw err
                    else {
                        console.log(info)
                    }
                })

                //WORK WITH DB
                newUser.password = password_hash

                db.query(query, newUser, (err, resQ) => {
                    if (err) throw err
                    else {
                        console.log(resQ)
                        resp.statuCode = 201
                        console.log(resQ);
                        resp.send(" <h1 style= 'color : red '> Please check your email  " + newUser.username + "  to verify your account </h1>")
                    }
                })
            }
        }
    })
}

exports.login = (req, resp) => {
    let creedantials = new Creedantials(
        "ariyon.mohammad@logdots.com",
        "Pass1as234"
    )
    //search user by username and password

    let query = `
                   SELECT * 
                   FROM USERS 
                   WHERE username='${creedantials.username}' `
    db.query(query, (err, resQ) => {
        if (err) throw err
        else {
            console.log(resQ)

            if (resQ === 0) {
                resp.send("user not fount try again ! 🏀")
            }
            else {
                if (CompairePassword(creedantials.password, resQ[0]?.password)) {
                    resp.statuCode = 200
                    resp.send("hello hello again welcome on our new test")
                }
                else resp.send("EROOR")

            }
        }
    })

}

exports.Resend = (req, resp) => {

    db.query(`      SELECT isVerified,dateUser FROM USERS 
                    WHERE  username='${req.params.userEmail}' 
         `, (error, resQQ) => {
        if (error) throw error
        else {
            if (resQQ.length == 0) {
                resp.send('<h1>username  not found</h1>')
            }
            else {
                if (resQQ[0].isVerified === 1) {
                    resp.send('<h1>this mail has been already verified</h1>')
                }
                else {
                    let token = setMailToken(randomString.generate())

                    db.query(` UPDATE USERS SET  dateUser =  NOW(), emailToken = ${token}
                               WHERE username='${req.params.userEmail}'`, (err, resq) => {
                        if (err) throw err
                        const mailOptions = {
                            from: "todoApp@gmc.com",
                            to: newUser.username,
                            subject: "Please Verify your email Account",
                            html: ` <h1>This mail will expire in 24 hour</h1>
                                    <a href="http://localhost:9000/api/auth/resend/${newUser.username}/code/${newUser.emailToken}">Verify My Email</a>`
                        }

                        transport.sendMail(mailOptions, (err, info) => {
                            if (err) throw err
                            else {
                                console.log(info)
                            }
                        })

                    })


                }

            }
        }
    })

}

exports.ForgotPassword = (req, resp) => {


    let usernamePattern = /^.{4,30}$/

    if (!usernamePattern.test(req.params.userEmail)) {
        resp.send(" <h1 style ='color:red';'text-align : center'; > Username Invalid </h1>")
        return
    }

    db.query(`  SELECT * FROM USERS 
                WHERE  username='${req.params.userEmail}' `
        , (err, resQ) => {
            if (err) throw err
            else {
                console.log(resQ)
                if (resQ.length === 0) {
                    resp.send(" <h1 style =' color : red'> This username do not exist please try to register")
                }
                else {
                    //generate Token for the user 
                    const secretToken = randomString.generate()

                    db.query(` UPDATE USERS SET SENDMAILDATE= NOW() , emailToken ='${secretToken}' 
                              WHERE username = '${req.params.userEmail}' `, (err, resQ) => {

                        if (err) throw err
                        else {
                            const mailOptions = {
                                from: "todoApp@gmc.com",
                                to: req.params.userEmail,
                                subject: "Reset your password",
                                html: `
                            <h1>This mail will expire in 24 hour</h1>
                            <a href="http://localhost:9000/auth/Reset-Password/${req.params.userEmail}/code/${secretToken}">change your password:) </a>`
                            }

                            resp.send("verify ur email")
                            transport.sendMail(mailOptions, (err, info) => {
                                if (err) throw err
                                else {
                                    console.log(info)
                                }
                            })
                        }

                    })

                }
            }
        }


    )


}
