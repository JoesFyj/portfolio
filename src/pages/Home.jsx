import Hero from '../components/Hero'
import HomeAbout from '../components/HomeAbout'
import HomeValues from '../components/HomeValues'
import HomeQuiz from '../components/HomeQuiz'
import Portfolio from '../components/Portfolio'
import HomeTimeline from '../components/HomeTimeline'
import HomeConnect from '../components/HomeConnect'
import Footer from '../components/Footer'

export default function Home({ lang, theme }) {
  return (
    <>
      <Hero lang={lang} theme={theme} />
      <HomeAbout theme={theme} />
      <HomeValues theme={theme} />
      <HomeQuiz theme={theme} />
      <Portfolio theme={theme} />
      <HomeTimeline theme={theme} />
      <HomeConnect theme={theme} />
      <Footer theme={theme} />
    </>
  )
}
