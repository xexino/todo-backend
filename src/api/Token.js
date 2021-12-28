const { db } = require("../config/mysql");
const { UserModal } = require("../model/user");

let currentdate = new Date(Date.now())

// console.log(currentdate.getTime() < currentdate.getTime() + 600000)

exports.TokenUser = (req, resp) => {

  // Reset the flag of iserified to true


  db.query(`  SELECT isVerified,dateUser FROM USERS 
              WHERE  username='${req.params.userEmail}' 
              AND emailToken = '${req.params.emailToken}'
           `, (error, resQQ) => {
    if (error) throw error
    else {
      if (resQQ.length == 0) {
        let query = ` SELECT isVerified FROM USERS
                        WHERE   username='${req.params.userEmail}' `
        db.query(query, (err, resQ) => {

          if (err) throw err
          else {
            console.log(resQ)
            if (resQ[0]?.isVerified == 1) {
              resp.send("<h1 style = 'text-align : center'>This mail has been already verified</h1>")

            }
          }
        })
      }
      else {
        //verify the date of the token if it expired or not
        let currentdate = new Date(Date.now())
        console.log(currentdate.getTime())


        if (currentdate.getTime() > resQQ[0].dateUser.getTime() + 6000000) {
          db.query(`  UPDATE USERS SET isVerified = 1  , emailToken=''
                  WHERE username='${req.params.userEmail}'
              `, (err, resQ) => {
            if (err) throw err
            else {
              console.log(resQ)
              resp.send("<h1 style = 'text-align : center'>Thank you for registering & verifying your email 🎯 !! </h1>")
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