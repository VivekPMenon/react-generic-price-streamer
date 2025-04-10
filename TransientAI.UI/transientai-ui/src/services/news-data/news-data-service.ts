import { webApihandler } from "../web-api-handler";
import { endpointFinder } from "../web-api-handler/endpoint-finder-service";
import { Article, ConsolidatedArticles } from "./model";

class NewsDataService {

  readonly newsApiName = 'news-api';
  readonly openAiApiName = 'openai-api';

  async getArticles(): Promise<Article[]> {
    const result = await webApihandler.get('top-headlines', {
      country: 'us',
      apiKey: endpointFinder.getCurrentEnvInfo().newsApiKey
    }, {
      serviceName: this.newsApiName
    });

    return result.articles;
  }

  async getBreakingNews(): Promise<ConsolidatedArticles> {
    const result = await webApihandler.get('news', {}, {
      serviceName: this.openAiApiName
    });

    return result;
  }

  async getArticlesMock(): Promise<any[]> {
    return [
      {
        "source": {
          "id": "the-washington-post",
          "name": "The Washington Post"
        },
        "author": "Shane O’Neill, Jesús Rodríguez",
        "title": "How Village People went from Disco 1.0 to Trump 2.0 - The Washington Post",
        "description": "Village People, the disco band whose “Y.M.C.A.” is like a new national anthem, is performing during Donald Trump’s inauguration festivities.",
        "url": "https://www.washingtonpost.com/style/power/2025/01/19/village-people-trump-inauguration-ymca-washington-inaugural-balls-victory-rally/",
        "urlToImage": "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/3JPC3N55JS2KAMFFRL46UMQ3YA_size-normalized.jpg&w=1440",
        "publishedAt": "2025-01-20T00:22:01Z",
        "content": "It is 2025, and the new national anthem is a disco song from 1978. What is going on?\r\nVillage People whose Y.M.C.A. is a central text of the Trump era is the unofficial headliner of Donald Trumps sec… [+9054 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "Yahoo Entertainment"
        },
        "author": "Liz Kocan",
        "title": "Baltimore Ravens vs. Buffalo Bills Divisional Round Playoff game: How to watch, kickoff time and more - Yahoo Sports",
        "description": "The Ravens vs. Bills playoff game is this Sunday night on CBS and Paramount+, here's what you need to know.",
        "url": "https://sports.yahoo.com/baltimore-ravens-vs-buffalo-bills-divisional-round-playoff-game-how-to-watch-kickoff-time-and-more-125519248.html",
        "urlToImage": "https://s.yimg.com/ny/api/res/1.2/SmvmWcJ_1zs56NqezsgRWA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA-/https://s.yimg.com/os/creatr-uploaded-images/2025-01/0380daf0-d1ca-11ef-bfdf-2b7350811f0d",
        "publishedAt": "2025-01-19T23:45:36Z",
        "content": "DirecTV Stream's new MySports package gets you access to all the usual football suspects: NFL Network, ESPN, ABC, NBC, CBS and, of course, FOX, \r\nRight now, you can try all this out free, and then ge… [+434 chars]"
      },
      {
        "source": {
          "id": "associated-press",
          "name": "Associated Press"
        },
        "author": "DAVID HAMILTON",
        "title": "How TikTok grew from a fun app for teens into a potential national security threat - The Associated Press",
        "description": "If it feels like TikTok has been around forever, that’s probably because it has, at least if you’re measuring via internet time. What’s now in question is whether it will be around much longer and, if so, in what form? The Chinese social video app merged in 2…",
        "url": "https://apnews.com/article/tiktok-ban-biden-timeline-india-119969bfc584e92d47baa189a3e1c4fc",
        "urlToImage": "https://dims.apnews.com/dims4/default/0c872ba/2147483647/strip/true/crop/4644x2612+0+242/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fd4%2F90%2F5b9351a8a339761784aa99977006%2Ffded76dbaf0e42cfb6861ecfe88166e8",
        "publishedAt": "2025-01-19T22:19:00Z",
        "content": "SAN FRANCISCO (AP) If it feels like TikTok has been around forever, thats probably because it has, at least if youre measuring via internet time. Whats now in question is whether it will be around mu… [+10453 chars]"
      },
      {
        "source": {
          "id": "cnn",
          "name": "CNN"
        },
        "author": "Allison Chinchar, Lauren Mascarenhas",
        "title": "Over 75% of the US expected to face freezing temperatures this week as rare winter storm barrels toward the South - CNN",
        "description": "Most of the United States is being assailed with extreme winter weather this week as Arctic air blasts south from Canada, snow tracks up the Northeast coast and a potentially crippling winter storm takes aim at the South.",
        "url": "https://www.cnn.com/2025/01/19/weather/weather-cold-winter-temperature-freezing/index.html",
        "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/2025-01-17t194030z-1895194076-rc2vbca8l247-rtrmadp-3-usa-trump-inauguration-copy.jpg?c=16x9&q=w_800,c_fill",
        "publishedAt": "2025-01-19T22:11:00Z",
        "content": "Most of the United States is being assailed with extreme winter weather this week as Arctic air blasts south from Canada, snow tracks up the Northeast coast and a potentially crippling winter storm t… [+3812 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "Bleeding Green Nation"
        },
        "author": "Alexis Chassen",
        "title": "2025 NFL Playoffs: Eagles vs. Rams third quarter scores updates - Bleeding Green Nation",
        "description": "After the first half, the Eagles lead the Rams by a score of 13 to 10.",
        "url": "https://www.bleedinggreennation.com/2025/1/19/24347337/2025-nfl-playoffs-eagles-vs-rams-third-quarter-scores-updates-nfc-divisional-round-game-thread",
        "urlToImage": "https://cdn.vox-cdn.com/thumbor/AaFjw8zIs272b6VAP5CChQ93G5E=/0x0:3995x2092/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/25838407/2194765805.jpg",
        "publishedAt": "2025-01-19T21:25:55Z",
        "content": "This is your third quarter thread for the NFC Divisional Round game between the Philadelphia Eagles and Los Angeles Rams. Join the discussion in the comments below.\r\nHere is some basic information to… [+226 chars]"
      },
      {
        "source": {
          "id": "cnn",
          "name": "CNN"
        },
        "author": "Nadeen Ebrahim, Mike Schwartz",
        "title": "‘Everybody is crying’: Israelis rejoice as 3 hostages returned after more than 470 days in Gaza - CNN",
        "description": "Carrying her small daughter, an Israeli mother stood amid a crowd of people next to the helipad of the Sheba Medical Center in Tel Aviv, which on Sunday received the three former hostages released in a ceasefire and hostage deal with Hamas.",
        "url": "https://www.cnn.com/2025/01/19/middleeast/israel-reaction-hostage-release-gaza-intl-latam/index.html",
        "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/ap25019590049886.jpg?c=16x9&q=w_800,c_fill",
        "publishedAt": "2025-01-19T21:14:00Z",
        "content": "Carrying her small daughter, an Israeli mother stood amid a crowd of people next to the helipad of the Sheba Medical Center in Tel Aviv, which on Sunday received the three former hostages released in… [+4545 chars]"
      },
      {
        "source": {
          "id": "the-jerusalem-post",
          "name": "The Jerusalem Post"
        },
        "author": "By  JOANIE MARGULIES",
        "title": "'Completion certificates' Hamas members gave to released captives included Red Cross signatures - The Jerusalem Post",
        "description": "The items inside the bag gave a clear depiction of psychological torture methods Hamas used on captives - and tried to send it with them into their lives post-captivity.",
        "url": "https://www.jpost.com/breaking-news/article-838279",
        "urlToImage": "https://images.jpost.com/image/upload/f_auto,fl_lossy/c_fill,g_faces:center,h_407,w_690/644851",
        "publishedAt": "2025-01-19T21:06:00Z",
        "content": "Two of the recently released Gaza hostages, Emily Damari and Romi Gonen, who were held together in captivity, were forced by Hamas to participate in a staged ceremony where they received \"gifts and s… [+925 chars]"
      },
      {
        "source": {
          "id": "associated-press",
          "name": "Associated Press"
        },
        "author": null,
        "title": "Bird flu found in a Georgia commercial flock for the 1st time amid the nationwide outbreak - The Associated Press",
        "description": "Bird flu has been detected in a Georgia commercial poultry flock for the first time since a countrywide outbreak in 2022. The state is the country's top chicken producer. The Georgia Department of Agriculture says the Highly Pathogenic Avian Influenza virus w…",
        "url": "https://apnews.com/article/bird-flu-georgia-chicken-commercial-flock-a5bcad4662d4cf60212f6acb4a55d2ad",
        "urlToImage": "https://dims.apnews.com/dims4/default/6300580/2147483647/strip/true/crop/2579x1451+0+303/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fdb%2F2c%2Fdb25d25ef830b163ca71882e08d7%2Fe2874560cc924023ab50d795e1b9076b",
        "publishedAt": "2025-01-19T21:04:00Z",
        "content": "ATLANTA (AP) For the first time since the 2022 countrywide outbreak, bird flu hit a poultry producer in Georgia, the nations top state for chicken production.\r\nThe state Department of Agriculture ann… [+2775 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "Financial Times"
        },
        "author": "Myles McCormick, James Politi, Aime Williams, Felicia Schwartz",
        "title": "Donald Trump plans blitz of executive orders for first days in White House - Financial Times",
        "description": "Incoming president expected to issue orders on deportations, tariffs and cuts to regulation",
        "url": "https://www.ft.com/content/79e9ae9f-66c6-481e-a412-4c6475785109",
        "urlToImage": "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fd7c402b6-d071-4bc3-8a15-b75deeed6e8d.jpg?source=next-barrier-page",
        "publishedAt": "2025-01-19T21:00:57Z",
        "content": "FT newspaper delivered Monday-Saturday, plus FT Digital Edition delivered to your device Monday-Saturday.\r\n<ul><li></li>Weekday Print Edition<li></li>FT Weekend<li></li>FT Digital Edition<li>Global n… [+105 chars]"
      },
      {
        "source": {
          "id": "associated-press",
          "name": "Associated Press"
        },
        "author": "SOPHIA TAREEN",
        "title": "Immigrants in Chicago and other US cities brace for expected Trump deportation arrests - The Associated Press",
        "description": "Immigrants in Chicago and other U.S. cities have been preparing for immigration arrests since President-elect Donald Trump won the November election. Some have left voluntarily. Others have been designating power of attorney to trusted friends, making plans f…",
        "url": "https://apnews.com/article/immigration-deportation-arrests-chicago-cities-enforcement-ee9bd0542e0641cf606a32cef8676b20",
        "urlToImage": "https://dims.apnews.com/dims4/default/f5e2cdf/2147483647/strip/true/crop/5921x3331+0+309/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F36%2Fcb%2F82039b6707d213ceb3613aa66238%2F47842359c0e94455836c17d7b2a80e9d",
        "publishedAt": "2025-01-19T20:38:00Z",
        "content": "CHICAGO (AP) The Rev. Homero Sanchez said he didnt realize the depth of fear in the Chicago immigrant community he serves until someone asked him to handle the sale of their familys home and other fi… [+6026 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "Investor's Business Daily"
        },
        "author": null,
        "title": "Dow Jones Futures: Trump Inauguration Looms; $TRUMP Meme Coin Soars, TikTok Restoring Service - Investor's Business Daily",
        "description": "The S&P 500 and Nasdaq have reclaimed 50-day lines as many stocks flash buy signals.",
        "url": "https://www.investors.com/market-trend/stock-market-today/dow-jones-futures-donald-trump-inauguration-meme-coin-tiktok/",
        "urlToImage": "https://www.investors.com/wp-content/uploads/2020/11/Stock-trump2020-08-shutt.jpg",
        "publishedAt": "2025-01-19T20:22:00Z",
        "content": "Dow Jones futures will open Sunday evening, along with S&amp;P 500 futures and Nasdaq futures. U.S. markets will be closed Monday for the Martin Luther King holiday. Donald Trump's inauguration also … [+7621 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "Live Science"
        },
        "author": "Joanna Thompson",
        "title": "Astronomers find hundreds of 'hidden' black holes — and there may be billions or even trillions more - Livescience.com",
        "description": "Black holes that have been obscured by clouds of dust still emit infrared light, enabling astronomers to spot them for the very first time",
        "url": "https://www.livescience.com/space/black-holes/astronomers-find-hundreds-of-hidden-black-holes-and-there-may-be-billions-or-even-trillions-more",
        "urlToImage": "https://cdn.mos.cms.futurecdn.net/KYy3vtrNLPPYfY93Zf3uoH-1200-80.jpg",
        "publishedAt": "2025-01-19T20:00:00Z",
        "content": "Astronomers have discovered hundreds of hidden supermassive black holes lurking in the universe — and there may be billions or even trillions more out there that we still haven't found.\r\nThe research… [+4158 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "MassLive.com"
        },
        "author": "Chris Cotillo | ccotillo@MassLive.com",
        "title": "As Tanner Scott joins Dodgers, where will Red Sox turn for bullpen addition? - MassLive.com",
        "description": "Tanner Scott won't be coming to Boston after signing a four-year, $72 million deal with the Dodgers. So where can the Red Sox turn for relief help before spring training?",
        "url": "https://www.masslive.com/redsox/2025/01/as-tanner-scott-joins-dodgers-where-will-red-sox-turn-for-bullpen-addition.html",
        "urlToImage": "https://www.masslive.com/resizer/v2/CITRWXTG2ZFMTEPY7DVLRAEXYE.jpg?auth=6b71fbad2a8ed0bbb7f538ce1e3996a0ebcf011504d4ece723636db5cce62a6d&width=1280&quality=90",
        "publishedAt": "2025-01-19T19:16:00Z",
        "content": "The top reliever on this years free agent market is now off the board, and once again, the Red Sox have been cast as a bridesmaid and not a bride.\r\nLeft-hander Tanner Scott agreed to a four-year, $72… [+3968 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "Tipranks.com"
        },
        "author": "Ben Mahaney",
        "title": "J.P. Morgan Weighs In on Intel Stock Amid Takeover Rumors - TipRanks",
        "description": "Intel (NASDAQ:INTC) shares surged nearly 9% on Friday as rumors of a potential takeover reignited investor excitement. The technology news site SemiAccurate sparked...",
        "url": "https://www.tipranks.com/news/j-p-morgan-weighs-in-on-intel-stock-amid-takeover-rumors",
        "urlToImage": "https://blog.tipranks.com/wp-content/uploads/2025/01/INTC-Musk-1-750x406.jpg",
        "publishedAt": "2025-01-19T19:13:29Z",
        "content": ""
      },
      {
        "source": {
          "id": "the-washington-post",
          "name": "The Washington Post"
        },
        "author": "Gregory S. Schneider",
        "title": "Virginia House Speaker Don Scott receives pardon from President Biden - The Washington Post",
        "description": "Del. Don Scott (D-Portsmouth), the first Black person to serve as speaker of the Virginia House of Delegates, was convicted in 1994 of a non-violent federal drug-related offense.",
        "url": "https://www.washingtonpost.com/dc-md-va/2025/01/19/virginia-biden-pardon-don-scott/",
        "urlToImage": "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/PXLSW45HPFCSLZ64BRJWPVSNME_size-normalized.JPG&w=1440",
        "publishedAt": "2025-01-19T19:08:28Z",
        "content": "RICHMOND Virginia House Speaker Don Scott (D-Portsmouth) and his wife, Mellanda, were having their coffee and slowly getting ready for church Sunday morning when the phone call that Scott had been ho… [+5740 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "ELLE.com"
        },
        "author": "Aimée Lutkin",
        "title": "Justin Bieber Calls Hailey Bieber the 'Greatest Woman' He Has Ever Known - AOL",
        "description": "Justin Bieber shared a sweet photo of his wife Hailey Bieber on his Instagram photos from their trip to Aspen, declaring his love.",
        "url": "https://www.elle.com/culture/celebrities/a63473314/justin-bieber-calls-hailey-bieber-greatest-woman-ever-known/",
        "urlToImage": "https://hips.hearstapps.com/hmg-prod/images/justin-bieber-and-hailey-bieber-are-seen-on-january-05-2025-news-photo-1737303403.pjpeg?crop=1.00xw:0.334xh;0,0.0459xh&resize=1200:*",
        "publishedAt": "2025-01-19T19:04:55Z",
        "content": "On Saturday, Justin Bieber shared a sweet photo of his wife Hailey Bieber in his Instagram Stories. In the black-and-white pic, the Rhode founder is wearing a long dark coat cinched at the waist with… [+1627 chars]"
      },
      {
        "source": {
          "id": "cbs-news",
          "name": "CBS News"
        },
        "author": null,
        "title": "At least 80 dead, several kidnapped in Colombia after failed peace talks, official says - CBS News",
        "description": "At least 80 people were killed in northeast Colombia following failed attempts at peace talks with the National Liberation Army, a Colombian official said.",
        "url": "https://www.cbsnews.com/news/kidnapped-colombia-peace-talks-fail-rebel-national-liberation-army/",
        "urlToImage": "https://assets2.cbsnewsstatic.com/hub/i/r/2025/01/19/6afb3a13-c399-4530-9256-5b2d2b8a79ac/thumbnail/1200x630/099c80b518aa1e6fbe1821f7729c1f73/colombia.jpg?v=b37f0cace52a6645c18f53563f47da2c",
        "publishedAt": "2025-01-19T19:02:16Z",
        "content": "More than 80 people have been killed in Colombia's northeast region following failed attempts to hold peace talks with the National Liberation Army, a Colombian official said.\r\nTwenty others have bee… [+3051 chars]"
      },
      {
        "source": {
          "id": "reuters",
          "name": "Reuters"
        },
        "author": "Tim Reid, Joseph Ax",
        "title": "Trump holds victory rally in Washington ahead of inauguration - Reuters",
        "description": "Trump's \"Make America Great Again Victory Rally\" marks his first major speech in Washington since he urged his supporters to march on the Capitol on Jan. 6, 2021, in protest against his defeat.",
        "url": "https://www.reuters.com/world/us/trump-holds-victory-rally-washington-ahead-inauguration-2025-01-19/",
        "urlToImage": "https://www.reuters.com/resizer/v2/W3SBXS6C4FIB3BWSRJNAQVAAXM.jpg?auth=7b0feb942c120aa226570e4a20f0d30148e3a55e63f6fb9d9cd89e9987f0a069&height=1005&width=1920&quality=80&smart=true",
        "publishedAt": "2025-01-19T17:57:58Z",
        "content": null
      },
      {
        "source": {
          "id": "the-jerusalem-post",
          "name": "The Jerusalem Post"
        },
        "author": "By  REUTERS",
        "title": "Hamas says Israeli ceasefire violations could endanger hostages - The Jerusalem Post",
        "description": "Hamas said the group would abide by a ceasefire agreement that came into force in Gaza on Sunday but that any",
        "url": "https://www.jpost.com/breaking-news/article-838252",
        "urlToImage": "https://images.jpost.com/image/upload/f_auto,fl_lossy/c_fill,g_faces:center,h_407,w_690/568405",
        "publishedAt": "2025-01-19T16:45:00Z",
        "content": "Hamas said the group would abide by a ceasefire agreement that came into force in Gaza on Sunday but that any possible Israeli violations would endanger the process and put the lives of hostages at r… [+129 chars]"
      },
      {
        "source": {
          "id": null,
          "name": "Variety"
        },
        "author": "Rebecca Rubin",
        "title": "‘Mufasa’ Keeps Crown as Keke Palmer’s ‘One of Them Days’ Beats ‘Wolf Man’ in Box Office Surprise - Variety",
        "description": "Universal's \"Wolf Man\" reboot was projected to climb to No. 1 on domestic box office charts. Yet Sony's \"One of Them Days\" may have the last laugh.",
        "url": "https://variety.com/2025/film/box-office/keke-palmer-one-of-them-days-box-office-win-wolf-man-misses-1236278322/",
        "urlToImage": "https://variety.com/wp-content/uploads/2025/01/one-of-them-days-1.jpg?w=1000&h=563&crop=1",
        "publishedAt": "2025-01-19T16:19:00Z",
        "content": "Heading into the long weekend, Universal’s “Wolf Man” reboot was projected to climb to No. 1 on domestic box office charts. Yet Sony’s “One of Them Days,” an R-rated buddy comedy starring Keke Palmer… [+5619 chars]"
      }
    ]
  }
}

export const newsDataService = new NewsDataService();