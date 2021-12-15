const { db } = require("../config/mysql");

exports.ResetPassword = (req, resp) => {

    // fetch data (password if it valid or not)
    let newpassword = "Pass1as234"

    var passwordPatern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;

    if (!passwordPatern.test(newpassword)) {

        resp.send(" <h1 style =' color : blue' > " + "password should be at least 8  and  max 12")

        return
    }

    db.query(`  SELECT SENDMAILDATE FROM USERS 
                WHERE  username='${req.params.userEmail}' 
                AND    emailToken = '${req.params.emailToken}'
             `, (error, resQQ) => {
        if (error) throw error
        else {
            if (resQQ.length === 0) {
                resp.send("<h1 style = 'text-align : center'>Invalid Token</h1>")
            }
            else {
                let currentdate = new Date(Date.now())

                if (currentdate.getTime() > resQQ[0].SENDMAILDATE.getTime() + 6000000) {
                    db.query(`  UPDATE USERS SET PASSWORD = SHA1('${newpassword}') , emailToken=''
                            WHERE username='${req.params.userEmail}'
                        `, (err, resQ) => {
                        if (err) throw err
                        else {
                            console.log(resQ)
                            resp.send("<h1 style = 'text-align : center'>Done 🎯 !! </h1>")
                        }
                    })
                }
                else {

                    resp.send("<h1 style = 'text-align : center'>   WA KHONA TOKEN HAS BEEN EXPIRED    </h1>")
                }

            }
        }
    })



}