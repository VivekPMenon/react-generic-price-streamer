import { Explorer } from '@/components/explorer/explorer';
import { Header } from './header'
import styles from './page.module.scss';
import { MainContentPanel } from '@/components/main-content-panel/main-content-panel';
import { Chatbot } from '@/components/chatbot/chatbot';

export default function Home() {
  return (
    <div className={styles.home}>
      <Header></Header>
      <main>
        <Explorer></Explorer>
        <MainContentPanel></MainContentPanel>
        <Chatbot></Chatbot>
      </main>
    </div>
  );
}
