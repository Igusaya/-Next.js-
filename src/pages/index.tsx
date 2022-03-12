import * as style from "../styles/index.module.css"
import Link from "next/link"

const Index = () => {
  return (
    <>
      <h1 className={style.h1Text} >こんちは</h1>
      {/* Linkを使わなくても遷移出来るが、ページがリフレッシュされてしまう。 */}
      <Link href="/contact">
        <a>Contactページに移動</a>
      </Link> 
    </>
  )
}

export default Index