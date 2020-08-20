import fetch from 'node-fetch'
import redirect from '@polka/redirect'
import qs from 'querystring'

export async function post(req, res) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.body.pokemon}`);
  let result;
  
  if (response.status === 200) {
    result = await response.json();
  } else {
    result = {error: "Pokemon not found"}
  }

  if (req.body.client) {
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': "application/json" })
      res.end(JSON.stringify(result))
    }, 1000)
  } else {
    const params = qs.stringify({id: result.id, name: result.name})
    redirect(res, `/?${params}`)
  }
}
