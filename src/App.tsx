import { transform } from 'sucrase';

// FIXME: JSX uses React so I want to use hono/jsx
const SAMPLE_CODE = `import React from 'https://esm.sh/react@18'
import { jsx, Fragment } from 'https://esm.sh/hono/jsx'
import { Hono } from 'https://esm.sh/hono'

const app = new Hono()

app.get('/hello', (c) => {
  const name = c.req.query('name')
  return c.text(\`Hello \${name}\!\`)
})

app.get('/jsx', (c) => {
  return c.html(
    <div>
      <h1>Hello JSX!</h1>
    </div>
  )
})

export default app`

function App() {
  const code = transform(SAMPLE_CODE, {
    transforms: ['typescript', 'jsx'],
  }).code
  // FIXME: JSX uses React so I want to use hono/jsx
  console.log(code)

  return (
    <iframe style={{width: '100%', height: '100%'}} sandbox='allow-scripts' srcDoc={`<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
  </head>
  <style>
    #browser {
      flex: 3;
      padding: 10px;
      min-width: 350px;
      max-width: 50vw;
    }
    form {
      display: flex;
      gap: 10px;
    }
    #result {
      margin-top: 20px;
    }
    #result > div {
      display: flex;
      justify-content: space-between;
    }
    #result > div > div {
      width: 50%;
    }
    #result > hr {
      margin: 10px 0;
    }
  </style>
  <body>
    <div id="browser">
      <form>
        <select id="method">
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="delete">DELETE</option>
        </select>
        <input id="path" type="text" autoComplete="off" value="/hello?name=Hono" />
        <button type="button" onclick="appRequest()">Send</button>
      </form>
      <div>
        <div>
          <small id="status"></small><br />
          <small id="headers"></small>
        </div>
        <hr />
        <div id="result"></div>
        <div id="error"></div>
      </div>
      <script>
const appRequest = async () => {
  try {
    const codeURL = URL.createObjectURL(new Blob([\`${code.replace(/`/g, "\\\`")}\`], { type: 'text/javascript' }))
    const { default: app } = await import(codeURL)
    const method = document.getElementById("method").value
    const path = document.getElementById("path").value
    const res = await app.request(path, {
      method,
    })
    const status = document.getElementById("status")
    const headers = document.getElementById("headers")
    const result = document.getElementById("result")
    status.textContent = res.status + " " + res.statusText
    headers.textContent = Object.entries(Object.fromEntries(res.headers)).map(([key, value]) => {
      return \`\${key}: \${value}\`
    }).join("\\n")
    result.textContent = await res.text()
  } catch (e) {
    console.log(e)
  }
}
      </script>
    </div>
  </body>
</html>`} />
  )
}

export default App
