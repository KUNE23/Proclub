const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
app.use(helmet())
app.use(cors({
origin: 'http://localhost:5173',
}))
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const moduleRoutes = require('./routes/modulesRoutes')
const projectRoutes = require('./routes/projectRoutes')
const quizRoutes = require('./routes/quizRoutes') 

app.use('/api/auth', authRoutes)
app.use('/api', courseRoutes)
app.use('/api', dashboardRoutes)
app.use('/api', moduleRoutes)
app.use('/api', projectRoutes)
app.use('/api', quizRoutes)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})