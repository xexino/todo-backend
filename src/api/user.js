

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

    console.log(req.body);

    //new object  Fetch data from req
    let newUser = new UserModal(
        req.body.firstName,
        req.body.lastName,
        req.body.userName,
        req.body.avatar_url,
        req.body.password)

    //VALIDATE DATAs

    let { password, username, lastname } = newUser

    var passwordPatern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;

    if (!passwordPatern.test(password)) {

        return resp.status(400).json({ message: 'invalid password' })

    }

    let usernamePattern = /^.{4,30}$/

    if (!usernamePattern.test(username)) {
        return resp.status(400).json({ message: 'invalid email' })

    }
    let lastnamePattern = /^.{4,30}$/


    if (!lastnamePattern.test(lastname)) {
        return resp.status(400).json({ message: 'invalid Lastname ' })

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

                return resp.status(400).json({ message: 'user already exist ' })

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
        req.body.username,
        req.body.password

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
                return resp.status(400).json({ message: 'user do not exist ' })

            }
            else {
                if (CompairePassword(creedantials.password, resQ[0]?.password)) {
                    resp.statuCode = 200
                    resp.send("hello hello again welcome on our new test")
                }
                else return resp.status(400).json({ message: 'emaeil or password are wrong' })


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

    if (!usernamePattern.test(req.body.username)) {
        // resp.send(" <h1 style ='color:red';'text-align : center'; > Username Invalid </h1>")
        // return
        return resp.status(400).json({ message: 'invalid Email' })

    }
    console.log(req.body.username)

    db.query(`  SELECT * FROM USERS 
                WHERE  username='${req.body.username}' `
        , (err, resQ) => {
            if (err) throw err
            else {
                console.log(resQ)
                if (resQ.length == 0) {
                    // resp.send(" <h1 style =' color : red'> This username do not exist please try to register")
                    return resp.status(400).json({ message: 'This username do not exist please try to register' })
                }
                else {
                    //generate Token for the user 
                    const secretToken = randomString.generate()

                    db.query(` UPDATE USERS SET SENDMAILDATE= NOW() , emailToken ='${secretToken}' 
                              WHERE username = '${req.body.username}' `, (err, resQ) => {

                        if (err) throw err
                        else {
                            const mailOptions = {
                                from: "todoApp@gmc.com",
                                to: req.body.username,
                                subject: "Reset your password",
                                html: `
                            <h1>This mail will expire in 24 hour</h1>
                            <a href="http://localhost:3000/auth/Reset-Password/${req.body.username}/code/${secretToken}">change your password:) </a>`
                            }

                            resp.status(400).json({ message: 'please check your mail box' })
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
