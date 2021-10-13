const express = require('express')
const https = require('https')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.redirect('/settings')
})

app.get('/settings', (req, res) => {
    res.render('settings.html')
})

app.get('/contact', (req, res) => {
  res.render('contacts.html')
})

app.post('/results', (req, res) => {
    const params = { city: req.body.city, units: req.body.units, appId: '310b6e9b5cff1d8dd262b98e8f28675b' }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ params.city }&appid=${ params.appId }&units=${ params.units }`

    https.get(url, response => {
        response.on('data', data => {
            const weatherData = JSON.parse(data)
            const imageURL= "http://openweathermap.org/img/wn/"+ weatherData.weather[0].icon +"@2x.png"
            const learnMoreUrl = `https://openweathermap.org/city/${ weatherData.id }?utm_source=openweathermap&utm_medium=widget&utm_campaign=html_old`
            // Get unit value
            var currUnit = '';
            if (req.body.units === 'metric') {
              currUnit += 'Celcium'
            } else {
              currUnit += 'Fahrenheit'
            }
            // Send Html Page as text/string
            res.set('Content-Type', 'text/html')
            const responseHtmlContent = `
            <!doctype html>
            <html lang="en" class="h-100">
            
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title> WeatherApp | Results </title>
              <link rel="shortcut icon" href="favicon.png" type="image/x-icon">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
                crossorigin="anonymous"></script>
              <style>
                .bd-placeholder-img {
                  font-size: 1.125rem;
                  text-anchor: middle;
                  -webkit-user-select: none;
                  -moz-user-select: none;
                  user-select: none;
                }
            
                @media (min-width: 768px) {
                  .bd-placeholder-img-lg {
                    font-size: 3.5rem;
                  }
                }
              </style>
              <link href="css/cover.css" rel="stylesheet">
            </head>
            
            <body class="d-flex h-100 text-center text-white bg-dark">
            
              <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <header class="mb-auto">
                  <div>
                    <h3 class="float-md-start mb-0">WeatherApp | Results</h3>
                    <nav class="nav nav-masthead justify-content-center float-md-end">
                      <a class="nav-link " href="/settings">Settings</a>
                      <a class="nav-link active" aria-current="page" href="/results">Results</a>
                      <a class="nav-link" href="/contact">Contact</a>
                    </nav>
                  </div>
                </header>
                <main class="px-3">
                  <h1 class="city"> Weather for ${ params.city }</h1>
                  <center>
                    <img class="icon" src="${ imageURL }" alt="">
                  </center>
                  <b>Temperature:</b> <p class="temperature">${ weatherData.main.temp } ${ currUnit } </p>
                  <b>Description:</b> <p class="description">${ weatherData.weather[0].description }</p>
                  <p class="lead p-3">
                    <a href="${ learnMoreUrl }" class="btn btn-lg btn-secondary fw-bold border-white bg-white">Details</a>
                    <a href="/settings" class="btn btn-lg btn-dark fw-bold border-white ">Find More Results</a>
                  </p>
                </main>
                </main>
            
                <footer class="mt-auto text-white-50">
                <p>Cover template for <a href="https://getbootstrap.com/" class="text-white-50">Bootstrap</a>, by <a href="https://twitter.com/mdo" class="text-white-50">@mdo</a>.</p>
              </footer>
            
              </div>
            
            
            
            </body>
            
            </html>`
            // huge html page here
            res.send(responseHtmlContent)

        })
    })
})

app.listen(3000, (req, res) => {
    console.log('OK')
})