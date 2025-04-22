import { fetchWithConcurrency } from './fetchWithConcurrency.js'; 

const urls = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
  'https://jsonplaceholder.typicode.com/posts/4'
];

const maxConcurrency = 2;

async function test() {
  const result = await fetchWithConcurrency(urls, maxConcurrency);
  console.log('Responses:');
  console.log(result);
}

test();
