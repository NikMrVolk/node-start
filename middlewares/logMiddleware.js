module.exports = function() {
   return function (req, res, next) {
      try {
         console.log('http://127.0.0.1:3005/api' + req.originalUrl)
         next()
      } catch (e) {
         console.log(e)
         return res.status(400).json({ message: `Login middleware error` })
      }
   }
}