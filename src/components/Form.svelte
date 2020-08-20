<script>
  import { stores } from "@sapper/app";

  const { page } = stores();

  function send(event) {
    state =
      fsm.states[state].on[event] ||
      console.warn("invalid state transiton", `${state} -> ${event}`) ||
      state;
  }

  const fsm = {
    initial: $page.query.id ? "fetched" : "idle",
    states: {
      idle: { on: { SUBMIT: "fetching" } },
      fetching: { on: { ERROR: "error", DONE: "fetched" } },
      error: { on: { SUBMIT: "fetching" } },
      fetched: { on: { SUBMIT: "fetching" } },
    },
  };

  let value,
    result = $page.query,
    state = fsm.initial;

  async function handleSubmit() {
    send("SUBMIT");

    result = await fetch(`/pokemon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pokemon: value, client: true }),
    }).then((res) => res.json());

    if (result.error) {
      send("ERROR");
    } else {
      send("DONE");
    }
  }
</script>

<style>
  form + div {
    margin-top: 2em;
  }
  .error {
    color: rebeccapurple;
    font-weight: bold;
    font-family: "Comic Sans MS";
  }

  .loading {
    opacity: 0.5;
  }

  noscript {
    background: yellow;
  }
  noscript + div {
    margin-top: 2em;
  }
</style>

<noscript>JS is disabled!!</noscript>

<div class="wrapper" class:loading={state === 'fetching'}>
  <form action="/pokemon" method="POST" on:submit|preventDefault={handleSubmit}>
    <label for="pokemon">My favourite pokemon</label>
    <input type="text" name="pokemon" id="pokemon" bind:value />

    <button type="submit">Submit</button>
  </form>

  {#if state === 'fetching'}
    <div>Your favourite pokemon is loading...</div>
  {/if}

  {#if state === 'fetched'}
    <div>
      Your favourite pokemon is {result.name}.
      <br />
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`}
        alt="A picture of {result.name}" />

      {#if result.abilities}
        <h3>Abilities:</h3>
        <ul>
          {#each result.abilities as { ability }}
            <li>{ability.name}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  {#if state === 'error'}
    <div class="error">
      Oh noOo! something went wrong:
      <br />
      {result.error}
    </div>
  {/if}
</div>
