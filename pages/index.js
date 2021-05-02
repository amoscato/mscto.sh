import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Input from '@material-ui/core/Input';
import Clipboard from 'react-clipboard.js';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [created, setCreated] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    const res = await fetch('/url', {
      body: JSON.stringify({
        url,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const result = await res.json();

    setCreated(`${window.location.origin}/${result.slug}`);

    console.log(result);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>mscto.sh</title>
        <meta name='description' content='URL Shortener' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          mscto<span>.sh</span>
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            placeholder='URL'
            name='url'
            type='text'
            value={url}
            onChange={e => setUrl(e.target.value)}
            fullWidth={true}
            required={true}
          ></Input>
        </form>

        {created.length > 0 && (
          <Clipboard className={styles.clip} data-clipboard-text={created} button-title='Click to copy'>
            {created}
          </Clipboard>
        )}
      </main>

      <footer className={styles.footer}>
        <a href='https://github.com/amoscato/' target='_blank' rel='noopener noreferrer'>
          Created by <span>Adam Moscato</span>
        </a>
      </footer>
    </div>
  );
}
