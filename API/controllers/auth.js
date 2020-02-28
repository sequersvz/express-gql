import bcrypt from "bcryptjs"
import User from "../db/model/user"
import jwt from "jsonwebtoken"


const signIn = (_, {input}) => {
    const {username, password} = input
        return new Promise((res) => {
            User.findOne({username}, (error, user) => {
    
                if(Boolean(user) && bcrypt.compareSync(password, user.password)) {
                    const accessToken = jwt.sign({id: user._id}, process.env.JWT_TOKEN, {expiresIn: 3600})
                    const refreshToken = jwt.sign({id: user._id}, process.env.JWT_REFRESH_TOKEN)
    
                    User.findByIdAndUpdate({_id: user._id}, {refreshToken},{useFindAndModify: false}, (error) => {
                        if(error) res({error: "error adding refresh token"})
                    })
    
                    res({accessToken, refreshToken})
                }

                res({error: "password or username incorrect"})
            })
        })
   
}


const signUp = (_, {input}) => {
    const {username, password} = input

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        return new Promise((res) => {
            
            User.findOne({username: username}).then( user => {
                if(Boolean(user)) {
                    res({error: "username already exist"})
                }
                new User({
                    username: username,
                    password: hash,
                    createdDate: new Date()
                }).save((error, note) => (error ? res({error: "request error, try later"}) 
                : res(true)))
            }).catch(error => res({error: error}))
        })

}

const logOut = (_, {accessToken}) => {
    return new Promise(res => {
        jwt.verify(accessToken, process.env.JWT_TOKEN, (jwtError, jwtUser) => {
            User.findById({_id: jwtUser.id}, (error, user) => {
                    if(error) return res({error: "error logout token"})
                    user.refreshToken = undefined
                    user.save()
                    res(true)
            })
        })
    })
}

const refreshToken = (_, {refreshToken}) => {

    return new Promise(res => {
        if(refreshToken === null) res({error: "missed refresh token"})

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (jwtError, jwtUser) => {
            if(jwtError) res({error:"error token"})
            console.log(jwtUser)
            User.findById({_id: jwtUser.id}).then((user) => {
                const accessToken = jwt.sign({id: user._id}, process.env.JWT_TOKEN, {expiresIn: 3600})
                res({accessToken})
            })
        })
    })
}


export {
    signIn,
    signUp,
    logOut,
    refreshToken
}