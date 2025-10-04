import { useEffect, useState } from "react";
import "./styles.css"
import { publish, subscribe } from "../app-record/event";
const All = [
    'かき',
    'あか',
    'あき',
    'きく',
    'いけ',
    'こい',
    'さけ',
    'しき',
    'すし',
    'あせ',
    'うそ',
    'うた',
    'した',
    'ちち',
    'ちかてつ',
    'つき',
    'そと',
    "あめ","あいさつ","あかい","あおい","いえ","いす","いと","いぬ","いし","うし","うたう","うれしい","うみ","うま","え","えいが","えんそく","えんそう","えんしゅつ","おもう","おとこ","おんな","おきる","おんせん","かく","かみ","かびん","かね","かさ","き","きく","きもの","きんし","きいろい","くろい","くさ","くすり","くも","くるま","けっこん","けんちく","けいたいでんわ","けしょうひん","こうつう","こころ","こども","こうよう","さいふ","さかな","さくら","さむい","さる","しつれい","しろい","しんぶん","しし","しかる","すいえい","すいか","すいせん","すき","せいかつ","せかい","せんせい","せんたく","せんす","そら","そうさ","そと","そんけい","そふ","たいそう","たいよう","たたみ","たつ","たてもの","ち","ちり","ちち","ちかい","ちいさい","つうしん","つき","つくえ","つかれる","つる","て","てんいん","てら","とけい","とり","とし","ならう","なつ","なく","なし","にく","にほん","にもつ","にわ","にじ","ぬの","ぬすむ","ぬるい","ぬう","ぬのこ","ねむい","ねる","ねこ","のうか","のうみん","はし","はな","はやし","はなび","はる","ひこうき","ひと","ひつじ","ふうせん","ふうりん","ふな","ふたり","ふゆ","へび","へや","へいき","へいげん","ゆきだるま","ゆき","ゆびわ","ゆめ","ゆうじん","ほん","ほとけ","ほうそう","ほし","ほしい","まつ","まど","まめ","まち","みかん","みずでっぽう","みずうみ","みち","みず","むし","むすめ","むしもの","むしめがね","めがね","め","めだまやき","もり","もみじ","もも","もうか","やじるし","やま","やけい","やかん","やさい","ようがし","よる","よみもの","ようふく","とら","りす","くり","つり","りりく","たべる","すわる","はしる","おちる","れっしゃ","れい","ろうそく","ろうじん","ろうか","わくせい","うちわ","わなげ","わがし","わかい","えをかく","じをかく","はをみがく","ほんをよむ","しごとをする"
]

const AKaSa = [
    "あい", "あか", "いあ", "いか", "うえ", "うお", "えあ", "えき", "おい", "おか",
    "かき", "かさ", "きく", "きそ", "くう", "くさ", "けあ", "けさ", "こい", "こえ",
    "さき", "さけ", "しあ", "しお", "すい", "すえ", "せい", "せか", "そい", "そか"
]

const TaNaHa = [
    "たに", "たま", "たつ", "たて", "たこ", // た行开头词
    "なか", "にわ", "ぬの", "ねつ", "のう", // な行开头词
    "はな", "ひる", "ふね", "へや", "ほし", // は行开头词
    "たい", "たる", "なみ", "にん", "はは", // 二次重复开头
    "てら", "とら", "ぬく", "ねる", "のこ", // 补充组合
    "はこ", "ひめ", "ふく", "へそ", "ほね", // 二次重复组合
    "たん", "なつ", "はる"  // 最后补充
]

const MaRa = [
    "まる", "まめ", "むら", "めも", "もり", // ま行开头（每个假名1次）
    "らく", "りく", "るい", "れき", "ろく", // ら行开头（每个假名1次）

    
    // 二次重复开头
    "みる", "みね", "むれ", "める", "もく", // ま行二次（み/む/め/も）
    "らん", "りん", "るす", "れる", "ろん", // ら行二次（ら/り/る/れ/ろ）

    // 补充组合
    "まり", "むり", "めり", "もら", "みら", // 跨行组合
    "らま", "りま", "るま", "れま", "ろま", // 反向组合

    // 特殊形式
    "みろ", "むろ", "めら", "もれ", "みれ"  // 长音/复合词
]

const YaWa = [
    "やわ", "やゆ", "やよ", // や行开头（や3次）
    "ゆや", "ゆわ", "ゆよ", // ゆ行开头（ゆ3次）
    "よや", "よゆ", "よわ", // よ行开头（よ3次）
    "わや", "わゆ", "わよ", // わ行开头（わ3次）

    
    // 二次重复组合
    "やよい", "ゆわく", "よわい", // 三音节词
    "わよう", "やゆれ", "ゆよむ", // 复合形式
    "やわら", "ゆわか", "よわり", // 允许长音但无他行假名

    // 特殊组合
    "やわよ", "ゆやわ", "よゆわ", // 三字交叉
    "わやよ", "わゆや", "よわゆ", // 逆向组合

    // 补充组合
    "やよわ", "ゆやよ", "よわや", // 混合结构
    "わよや", "ゆわよ", "やゆわ", // 最后补充
    "わやゆ", "よゆや", "ゆよわ"  // 确保总数30
]

const HiraganaManager = () => {
    // const pList = list.sort(() => Math.random() - 0.5)
    const [list, setList] = useState([])

    const setAll = () => {
        setList(All.sort(() => Math.random() - 0.5))
    }

    const setAKaSa = () => {
        setList(AKaSa.sort(() => Math.random() - 0.5))

    }

    const setTaNaHa = () => {
        setList(TaNaHa.sort(() => Math.random() - 0.5))

    }
    
    const setMaRa = () => {
        setList(MaRa.sort(() => Math.random() - 0.5))

    }

    const setYaWa = () => {
        setList(YaWa.sort(() => Math.random() - 0.5))
    }

    return (
        <>
        <button onClick={setAll}>All</button>
        <button onClick={setAKaSa}>あ-か-さ</button>
        <button onClick={setTaNaHa}>-ナ-ハ</button>
        <button onClick={setMaRa}>マ-ラ</button>
        <button onClick={setYaWa}>ヤ-ワ</button>
        {list.map((text, id) => <WordView pWord={{text, id}} />)}
        <Alphabet />
        </>
    )
};

const WordView = ({ pWord }) => {
    return (
        <div className="word" key={pWord.id}>
            {pWord.text}
        </div>
    )
}



const Alphabet = () => {
    const [shouldShowAlphabet, setShouldShowAlphabet] = useState(false)

    if (!shouldShowAlphabet) {
        return (
            <div className="fixed" onClick={e => setShouldShowAlphabet(true)}>
                alphabet
            </div>
        )
    }

    return (
        <div className="overlay">
            <div className="overlay-content">
            <table border="1">
  <tr>
    <th>清音</th>
    <th>a</th>
    <th>i</th>
    <th>u</th>
    <th>e</th>
    <th>o</th>
  </tr>
  <tr><th>あ行</th> <td>あ(a)</td> <td>い(i)</td> <td>う(u)</td> <td>え(e)</td> <td>お(o)</td></tr>
  <tr><th>か行</th> <td>か(ka)</td> <td>き(ki)</td> <td>く(ku)</td> <td>け(ke)</td> <td>こ(ko)</td></tr>
  <tr><th>さ行</th> <td>さ(sa)</td> <td>し(shi)</td> <td>す(su)</td> <td>せ(se)</td> <td>そ(so)</td></tr>
  <tr><th>た行</th> <td>た(ta)</td> <td>ち(chi)</td> <td>つ(tsu)</td> <td>て(te)</td> <td>と(to)</td></tr>
  <tr><th>な行</th> <td>な(na)</td> <td>に(ni)</td> <td>ぬ(nu)</td> <td>ね(ne)</td> <td>の(no)</td></tr>
  <tr><th>は行</th> <td>は(ha)</td> <td>ひ(hi)</td> <td>ふ(fu)</td> <td>へ(he)</td> <td>ほ(ho)</td></tr>
  <tr><th>ま行</th> <td>ま(ma)</td> <td>み(mi)</td> <td>む(mu)</td> <td>め(me)</td> <td>も(mo)</td></tr>
  <tr><th>や行</th> <td>や(ya)</td> <td>-</td> <td>ゆ(yu)</td> <td>-</td> <td>よ(yo)</td></tr>
  <tr><th>ら行</th> <td>ら(ra)</td> <td>り(ri)</td> <td>る(ru)</td> <td>れ(re)</td> <td>ろ(ro)</td></tr>
  <tr><th>わ行</th> <td>わ(wa)</td> <td>-</td> <td>を(wo)</td> <td>-</td> <td>ん(n)</td></tr>
  
  <tr><th>が行</th> <td>が(ga)</td> <td>ぎ(gi)</td> <td>ぐ(gu)</td> <td>げ(ge)</td> <td>ご(go)</td></tr>
  <tr><th>ざ行</th> <td>ざ(za)</td> <td>じ(ji)</td> <td>ず(zu)</td> <td>ぜ(ze)</td> <td>ぞ(zo)</td></tr>
  <tr><th>だ行</th> <td>だ(da)</td> <td>ぢ(ji)</td> <td>づ(zu)</td> <td>で(de)</td> <td>ど(do)</td></tr>
  <tr><th>ば行</th> <td>ば(ba)</td> <td>び(bi)</td> <td>ぶ(bu)</td> <td>べ(be)</td> <td>ぼ(bo)</td></tr>
  <tr><th>ぱ行</th> <td>ぱ(pa)</td> <td>ぴ(pi)</td> <td>ぷ(pu)</td> <td>ぺ(pe)</td> <td>ぽ(po)</td></tr>
</table>
<button style={{float: "right"}} onClick={e => setShouldShowAlphabet(false)}>close</button>

            </div>
        </div>
    )
}
export default HiraganaManager;