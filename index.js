const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const mongoose = require("mongoose")
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log("mongoose est connected")
})
app.use(cors())
const userSchema = new mongoose.Schema({

    Date: {
        type: Date,
    },
    userId: {
        type: String,

    },
    time: {
        type: String
    }

}, {
    timestamps: true,
});
const UserModel = mongoose.model("rendezVous", userSchema);
const SchemaDay = new mongoose.Schema({

    Date: {
        type: Date,
    }
}, {
    timestamps: true,
});
const DayInable = mongoose.model("DayInable", SchemaDay);
const SchemaTime = new mongoose.Schema({

    Date: {
        type: Date,
    },
    time: {
        type: [String]
    }

}, {
    timestamps: true,
});
const TimeModel = mongoose.model("TimeInable", SchemaTime);
app.post("/AddDesactiveDay", async(req, res) => {
    const date = req.body.date
    console.log("req.body", req.body)
    const newDate = await DayInable({ Date: req.body.date })
    newDate.save()
    res.json(newDate)
})
app.post("/addDesactiveTime", async(req, res) => {
    const date = req.body.date
    const Time = req.body.time

    const newDate = await TimeModel({ Date: date, time: Time })
    newDate.save()
    res.json(newDate)
})
app.get("/getTimeInable", async(req, res) => {
    // const date = req.body.date
    // const Time = req.body.time
    // console.log("req.body0", req.body)
    // const D = new Date(date).setDate(new Date(date).getDate() + 1);
    const newDate = await TimeModel.find({})
    console.log("TimeInable")
    res.send(newDate)
})
app.get("/getDayInable", async(req, res) => {
    const data = await DayInable.find({})
    res.json(data)

})
app.get("/getMyDate/:id", async(req, res) => {
    const id = req.params.id
    const data = await UserModel.findOne({ userId: id })
    console.log("data", data)
    res.json(data)

})
app.get("/getAllDay/:id", async(req, res) => {
    const id = req.params.id
    const data = await UserModel.find({ userId: { $ne: id } }, { time: 1, Date: 1, _id: 0 })
    res.json(data)

})
app.get("/getTimes", async(req, res) => {
    const timeOrigin = [
        { time: '8:00-8:30', available: true },
        { time: '8:30-9:00', available: true },
        { time: '9:00-9:30', available: true },
        { time: '9:30-10:00', available: true },
        { time: '10:00-10:30', available: true },
        { time: '10:30-11:00', available: true },
        { time: '11:00-11:30', available: true },
        { time: '11:30-12:00', available: true },
        { time: '13:00-13:30', available: true },
        { time: '13:30-14:00', available: true },
        { time: '14:00-14:30', available: true },
        { time: '14:30-15:00', available: true },
        { time: '15:00-15:30', available: true },
        { time: '15:30-16:00', available: true },
        { time: '16:00-16:30', available: true },
        { time: '16:30-17:00', available: true }
    ]


    res.json(timeOrigin)

})
app.post("/create", async(req, res) => {
    const userId = req.body.userId
    const date = req.body.date
    console.log("req.body", new Date(req.body.date))

    // const D = new Date(date).setDate(new Date(date).getDate() + 1);
    //, Date: { $gte: new Date().setDate(new Date().getDate() - 1) } 
    const data = await UserModel.find({ userId: userId })
    console.log("sahar", data)
    const time = await UserModel.find({ Date: date, time: req.body.time })
    if (time.length > 0) {
        return res.json({ msg: "error this date existe in database" })
    }
    if (data.length > 0) {
        const date = req.body.date
            // const D = new Date(date).setDate(new Date(date).getDate() + 1);

        const update = await UserModel.findOneAndUpdate({ userId: userId }, {
            Date: date,
            time: req.body.time,
            userId: userId
        })
        console.log("update", update)
        return res.json(update)
    }



    if (time.length === 0 && data.length === 0) {
        const date = req.body.date
        const data = new UserModel({ userId: userId, Date: date, time: req.body.time })
        data.save()
        return res.json(data)

    }


})
app.use(express.urlencoded({ extended: false }));
app.get("/Day", async(req, res) => {

    var today = new Date()

    var year = today.getFullYear()
    var month = today.getMonth()
    var date = today.getDate()

    let tab = []
    for (var i = 0; i < 15; i++) {
        var day = new Date(year, month, date + i)
        if (day.getDay() === 6 || day.getDay() === 0) {
            const item = {
                date: day,
                available: false
            }
            tab.push(item)
        } else {
            const item = {
                date: day,
                available: true,
                timeDesiable: []
            }
            tab.push(item)
        }
    }
    res.json(tab)
})
app.put("/getTime", async(req, res) => {
    console.log("req.body", req.body)
    const data = await UserModel.find({ Date: req.body.date })
    res.json(data)


})

app.listen(5000, console.log("app listen to post 5000"))