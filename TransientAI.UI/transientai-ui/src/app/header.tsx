import styles from './header.module.scss';

export function Header() {
  return (
    <header>
      <div className={styles.title}>
        <img src="/images/logo.png" />
        TransientAI
      </div>

      <div className='profile-pic'>
        VM
      </div>
    </header>
  );
}