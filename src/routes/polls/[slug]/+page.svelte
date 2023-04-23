<script>
  import { enhance } from '$app/forms';

  export let form;
  export let data;

  let loading = false;

  async function vote(event) {
    event.preventDefault();

    loading = true;

    const formData = new FormData(event.target);

    const voteData = {
      'pollID': data.slug,
      'value': formData.get('vote')
    };

    const response = await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify(voteData),
      headers: {
        'content-type': 'application/json'
      }
    });

    const pollData = await response.json();

    loading = false;
  }
</script>

<main>
    <button></button>


    <h1>Rate this poll:</h1>
    <form class="my-6" on:submit|preventDefault={vote}>

        <div class="flex ">
        <label>
            <input class="radio" type="radio" name="vote" value="1" />
            <p>😡</p>
        </label>

        <label>
            <input class="radio" type="radio" name="vote" value="2" />
            <p>🙁</p>
        </label>

        <label>
            <input class="radio" type="radio" name="vote" value="3" />
            <p>🫤</p>
        </label>

        <label>
            <input class="radio" type="radio" name="vote" value="4" />
            <p>😊</p>
        </label>

        <label>
            <input class="radio" type="radio" name="vote" value="5" />
            <p>😍</p>
        </label>
        </div>

        <button class="btn variant-filled-secondary" disabled={loading} type="submit">
            <span>:)</span>
        </button>
    </form>
</main>
