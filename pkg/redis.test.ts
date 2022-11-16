import { Redis } from "./redis.ts";
import { keygen, newHttpClient, randomID } from "./test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { afterEach } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { HttpClient } from "./http.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

Deno.test("when storing base64 data", async (t) => {
  await t.step("general", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = "VXBzdGFzaCBpcyByZWFsbHkgY29vbA";
    await redis.set(key, value);
    const res = await redis.get(key);
    assertEquals(res, value);
  });

  // decode("OK") => 8
  await t.step("getting '8'", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = 8;
    await redis.set(key, value);
    const res = await redis.get(key);
    assertEquals(res, value);
  });
  await t.step("getting 'OK'", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = "OK";
    await redis.set(key, value);
    const res = await redis.get(key);
    assertEquals(res, value);
  });
});

Deno.test("when destructuring the redis class", async (t) => {
  await t.step("correctly binds this", async () => {
    const { get, set } = new Redis(client);
    const key = newKey();
    const value = randomID();
    await set(key, value);
    const res = await get(key);
    assertEquals(res, value);
  });
});

Deno.test("zadd", async (t) => {
  await t.step("adds the set", async () => {
    const key = newKey();
    const score = 1;
    const member = randomID();

    const res = await new Redis(client).zadd(key, { score, member });
    assertEquals(res, 1);
  });
});

Deno.test("zrange", async (t) => {
  await t.step("returns the range", async () => {
    const key = newKey();
    const score = 1;
    const member = randomID();
    const redis = new Redis(client);
    await redis.zadd(key, { score, member });
    const res = await redis.zrange(key, 0, 2);
    assertEquals(res, [member]);
  });
});

Deno.test("middleware", async (t) => {
  let state = false;
  await t.step("before", async () => {
    const r = new Redis(client);
    r.use(async (req, next) => {
      state = true;

      return await next(req);
    });

    await r.incr(newKey());

    assertEquals(state, true);
  });

  await t.step("after", async () => {
    let state = false;
    const r = new Redis(client);
    r.use(async (req, next) => {
      const res = await next(req);
      state = true;
      return res;
    });

    await r.incr(newKey());

    assertEquals(state, true);
  });
});

Deno.test("vox", async (t) => {
  await t.step("vox", async () => {
    const key = newKey();
    const value = {
      "response": {
        "errors": [{
          "message":
            "#<PlaceableNativeContentLinkAd id=7026590> is not a supported HubPagePlaceable",
          "path": ["community", "frontPage", "placements", 9, "placeable"],
          "extensions": { "code": "UNIMPLEMENTED" },
        }],
        "data": {
          "community": {
            "frontPage": {
              "url": "https://www.theverge.com/",
              "seoSchema": [{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://www.theverge.com/",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate":
                      "https://www.theverge.com/search?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              }, {
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": "https://www.theverge.com/",
                "logo":
                  "https://cdn.vox-cdn.com/uploads/chorus_asset/file/24018771/verge_duet_500.png",
              }],
              "entryGroup": {
                "uid": "EntryGroup:51",
                "name": "Front Page",
                "groupType": "SITE_GROUP",
                "groupCommunity": {
                  "domain": "theverge.com",
                  "network": { "domain": "theverge.com" },
                },
                "slug": "front-page",
                "__typename": "EntryGroup",
              },
              "_id": 270,
              "community": { "_id": 372 },
              "layoutTemplateKey": "one_up",
              "placements": [
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:7c4151b3-5720-4544-b79b-a0669950f656",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "transportation",
                      "uid": "EntryGroup:29820",
                      "name": "Transpo",
                      "isInternal": false,
                    }, {
                      "slug": "elon-musk",
                      "uid": "EntryGroup:76615",
                      "name": "Elon Musk",
                      "isInternal": false,
                    }, {
                      "slug": "tesla",
                      "uid": "EntryGroup:45247",
                      "name": "Tesla",
                      "isInternal": false,
                    }, {
                      "slug": "law",
                      "uid": "EntryGroup:80480",
                      "name": "Law",
                      "isInternal": false,
                    }, {
                      "slug": "policy",
                      "uid": "EntryGroup:59",
                      "name": "Policy",
                      "isInternal": false,
                    }, {
                      "slug": "autonomous-cars",
                      "uid": "EntryGroup:67541",
                      "name": "Autonomous Cars",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Tesla on trial: Autopilot and Elon Musk’s $56 billion pay package under scrutiny in separate cases",
                    "promoHeadline": "Tesla on trial",
                    "dek": {
                      "html":
                        "Elon Musk will take the stand to defend his $56 billion compensation package as CEO of Tesla. At the same time, a manslaughter trial is set to begin in LA for a fatal crash caused by a Tesla owner operating Autopilot. ",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458254/elon-musk-tesla-trial-pay-shareholder-autopilot-crash",
                    "author": {
                      "fullName": "Andrew J. Hawkins",
                      "fullOrUserName": "Andrew J. Hawkins",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/andrew-j-hawkins",
                      },
                      "firstName": "Andrew J.",
                      "lastName": "Hawkins",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T21:01:57.600Z",
                    "originalPublishDate": "2022-11-14T21:01:57.600Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/jtN2gUjlNXS5wi0aC8HfKOy8mUQ=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/aJtodKbhzzCs_qEOjPvERkedZM8=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/jtN2gUjlNXS5wi0aC8HfKOy8mUQ=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/AMdmXVtfpHM-G9tdKLNpdbwKoLE=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/jtN2gUjlNXS5wi0aC8HfKOy8mUQ=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/ZjxIiibP5CdrTfw2BxgOctfY5CA=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/jtN2gUjlNXS5wi0aC8HfKOy8mUQ=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/aO2LzezYnkhtE-w1Wj-FjbyCvXw=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/jtN2gUjlNXS5wi0aC8HfKOy8mUQ=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/obO6ODEA_qWrSZ3QsofJ-1pXO0c=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090217/STK171_VRG_Illo_15_Normand_ElonMusk_15.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:784fca9e-60d7-4601-81f4-cdc3aa89e314",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "business",
                      "uid": "EntryGroup:20237",
                      "name": "Business",
                      "isInternal": false,
                    }, {
                      "slug": "elon-musk",
                      "uid": "EntryGroup:76615",
                      "name": "Elon Musk",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Buying ads on Twitter is ‘high-risk’ according to the world’s biggest ad agency",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "GroupM has joined IPG and Omnicom in warning clients about running their ads on Elon Musk’s platform. That’s not good for the company.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23459254/twitter-high-risk-ads-groupm-advertisers-content-moderation",
                    "author": {
                      "fullName": "Mitchell Clark",
                      "fullOrUserName": "Mitchell Clark",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/mitchell-clark",
                      },
                      "firstName": "Mitchell",
                      "lastName": "Clark",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-15T02:12:37.418Z",
                    "originalPublishDate": "2022-11-15T02:12:37.418Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/voukr_9z6AE5jboFhebWNP1q54g=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/40WFQKMtV1AMPg9loG9QEJMWYMg=/0x0:3000x2000/2400x1600/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration of a black Twitter bird in front of a red and white background.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/voukr_9z6AE5jboFhebWNP1q54g=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/q-XkFCFplkLAez1FbKezjKAYwyc=/0x0:3000x2000/2400x1920/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration of a black Twitter bird in front of a red and white background.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/voukr_9z6AE5jboFhebWNP1q54g=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/Hb8UDhzBUebSqYYwUmJXOipdSis=/0x0:3000x2000/2400x2400/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration of a black Twitter bird in front of a red and white background.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/voukr_9z6AE5jboFhebWNP1q54g=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/EowiY_aXSDVvC3n0hFvzx8s6Ti4=/0x0:3000x2000/2400x3429/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration of a black Twitter bird in front of a red and white background.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/voukr_9z6AE5jboFhebWNP1q54g=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/pWm3T4ZYRVTxEvgyf5DtBpAQSq4=/0x0:3000x2000/2400x1356/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration of a black Twitter bird in front of a red and white background.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyList" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:d019bcc6-bcdb-496f-a164-ce9bc3372d4f",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "platformer",
                      "uid": "EntryGroup:106235",
                      "name": "Platformer",
                      "isInternal": false,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "elon-musk",
                      "uid": "EntryGroup:76615",
                      "name": "Elon Musk",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Elon Musk ignored Twitter’s internal warnings about his paid verification scheme",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Employees and advertisers keep telling him about the risks of the changes he’s making to Twitter — but he’s not listening",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23459244/twitter-elon-musk-blue-verification-internal-warnings-ignored",
                    "author": {
                      "fullName": "Casey Newton",
                      "fullOrUserName": "Casey Newton",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/casey-newton",
                      },
                      "firstName": "Casey",
                      "lastName": "Newton",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [{
                      "fullOrUserName": "Zoe Schiffer",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/zoe-schiffer",
                      },
                    }],
                    "publishDate": "2022-11-15T01:35:02.256Z",
                    "originalPublishDate": "2022-11-15T01:35:02.256Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/weiPJ7jcby2hGcO_cWTHFPhzQUI=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/nD_qdus1nQk31Ib98MeYLMtVQeo=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "caption": null,
                        "asset": { "title": "Elon Musk illustration" },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/weiPJ7jcby2hGcO_cWTHFPhzQUI=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/kNZ5p0cpgIA3qrwqAcxAHGsavWI=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "caption": null,
                        "asset": { "title": "Elon Musk illustration" },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/weiPJ7jcby2hGcO_cWTHFPhzQUI=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/EKsYLLPzo6P4h09TALIBn1Sb4KM=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "caption": null,
                        "asset": { "title": "Elon Musk illustration" },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/weiPJ7jcby2hGcO_cWTHFPhzQUI=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/s8jnQGW9o7IRvtkbsb4pcYF_nVQ=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "caption": null,
                        "asset": { "title": "Elon Musk illustration" },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/weiPJ7jcby2hGcO_cWTHFPhzQUI=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/sUzbrFE-DeL5eZ7-vHOli_8h99U=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
                        "caption": null,
                        "asset": { "title": "Elon Musk illustration" },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyBlockquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyBlockquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyHTML" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "Elon Musk ignored Twitter’s internal warnings about paid verification",
                    "socialHeadline":
                      "Twitter employees warned Musk about his verification plans — he ignored them",
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:ee54cd44-25aa-4d56-8432-5f2a6b728b5d",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "elon-musk",
                      "uid": "EntryGroup:76615",
                      "name": "Elon Musk",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Elon Musk says he fired engineer who corrected him on Twitter",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Several people have called out Musk’s tweet about Twitter’s poor performance. One of them seems to have given up their job by doing so.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458247/elon-musk-fires-engineer-correcting-twitter",
                    "author": {
                      "fullName": "Mitchell Clark",
                      "fullOrUserName": "Mitchell Clark",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/mitchell-clark",
                      },
                      "firstName": "Mitchell",
                      "lastName": "Clark",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-15T00:51:02.576Z",
                    "originalPublishDate": "2022-11-14T20:43:30.040Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/IAzrDTfLkQP2m76_BTpPl-PalMc=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/bLIdRs5vPj5FXo6mleWnwk_Gsi4=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "caption": {
                          "plaintext":
                            "Pro tip: if you care about keeping your job, you probably shouldn’t tweet about how your boss’s “simps” are pro “dickriders.”",
                        },
                        "asset": {
                          "title": "Elon Musk in front of the Twitter logo.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/IAzrDTfLkQP2m76_BTpPl-PalMc=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/aDXM3Volhgxl0f6AE93fXPAEfqs=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "caption": {
                          "plaintext":
                            "Pro tip: if you care about keeping your job, you probably shouldn’t tweet about how your boss’s “simps” are pro “dickriders.”",
                        },
                        "asset": {
                          "title": "Elon Musk in front of the Twitter logo.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/IAzrDTfLkQP2m76_BTpPl-PalMc=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/9ZS3r0CDfcfWWrk2lMSjKAU_1hA=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "caption": {
                          "plaintext":
                            "Pro tip: if you care about keeping your job, you probably shouldn’t tweet about how your boss’s “simps” are pro “dickriders.”",
                        },
                        "asset": {
                          "title": "Elon Musk in front of the Twitter logo.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/IAzrDTfLkQP2m76_BTpPl-PalMc=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/Z_5LAz80fpSmKKpE4dD5qfkEyGE=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "caption": {
                          "plaintext":
                            "Pro tip: if you care about keeping your job, you probably shouldn’t tweet about how your boss’s “simps” are pro “dickriders.”",
                        },
                        "asset": {
                          "title": "Elon Musk in front of the Twitter logo.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/IAzrDTfLkQP2m76_BTpPl-PalMc=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/EvtOJPmwVm7PqemA3HIprLrlraU=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
                        "caption": {
                          "plaintext":
                            "Pro tip: if you care about keeping your job, you probably shouldn’t tweet about how your boss’s “simps” are pro “dickriders.”",
                        },
                        "asset": {
                          "title": "Elon Musk in front of the Twitter logo.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:7ea971fd-bd54-4d24-9ec4-bd9ce21862c1",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title": "“They’re all a bunch of cowards.”",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23459187/theyre-all-a-bunch-of-cowards",
                    "author": {
                      "fullName": "Nilay Patel",
                      "fullOrUserName": "Nilay Patel",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/nilay-patel",
                      },
                      "firstName": "Nilay",
                      "lastName": "Patel",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-15T00:23:18.549Z",
                    "originalPublishDate": "2022-11-15T00:23:18.549Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            '<a href="https://www.theverge.com/2022/11/14/23458247/elon-musk-fires-engineer-correcting-twitter">Fired Twitter engineer Eric Frohnhoefer</a> talks to Forbes, revealing that he discovered he was fired via Elon tweet and his laptop getting locked down; no one from the company actually called him.',
                        },
                        "placement": { "id": "KtWBVu" },
                      }, {
                        "__typename": "EntryBodyBlockquote",
                        "paragraphs": [{
                          "placement": { "id": "H53v1N" },
                          "contents": {
                            "html":
                              "“No one trusts anyone within the company anymore,” he said. “How can you function? Employees don’t trust the new management. Management doesn’t trust the employees. How do you think you’re supposed to get anything done? That’s why there’s production freezes – you can’t merge code, you can’t turn things on without permission from VPs.”",
                          },
                        }],
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryExternalLink",
                      "url":
                        "https://www.forbes.com/sites/cyrusfarivar/2022/11/14/musk-fires-twitter-engineer-on-twitter-cowards/?sh=72b8b8926063",
                      "title":
                        "Twitter Engineer Fired On Twitter Calls Musk’s Team “A Bunch Of Cowards”",
                      "source": "Forbes",
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:3558884e-5e6d-41fd-a333-08e7688431aa",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "business",
                      "uid": "EntryGroup:20237",
                      "name": "Business",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }],
                    "type": "QUICK_POST",
                    "title": "Ask A Manager has weighed in.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23459153/ask-a-manager-has-weighed-in",
                    "author": {
                      "fullName": "Monica Chin",
                      "fullOrUserName": "Monica Chin",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/monica-chin",
                      },
                      "firstName": "Monica",
                      "lastName": "Chin",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-15T00:09:47.039Z",
                    "originalPublishDate": "2022-11-15T00:09:47.039Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "A nervous Twitter employee, whose boss and coworkers are now gone, has written to the popular work advice column A<em>sk A Manager</em>, asking how the heck they should handle their company’s whole...situation. ",
                        },
                        "placement": { "id": "cUZd2y" },
                      }, {
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "Columnist Alison Green’s advice: Stick it out, if you can. “Staying at least gives you the option of severance down the road...and gives you an ongoing income and health insurance,” Green wrote. She added, “I’m sorry something you helped build is being needlessly destroyed.”",
                        },
                        "placement": { "id": "HUQMPw" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryExternalLink",
                      "url":
                        "https://www.askamanager.org/2022/11/i-work-at-twitter-what-do-i-do.html",
                      "title": "I work at Twitter ... what do I do?",
                      "source": "Ask a Manager",
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:3dd02080-6279-4fd7-bbb0-7df6d1ab9d8a",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "cryptocurrency",
                      "uid": "EntryGroup:71007",
                      "name": "Crypto",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "nft",
                      "uid": "EntryGroup:106682",
                      "name": "NFTs",
                      "isInternal": false,
                    }, {
                      "slug": "wearables",
                      "uid": "EntryGroup:54403",
                      "name": "Wearable",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Nike is still trying to make NFTs happen with .Swoosh",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The company’s launching .Swoosh, a Web3 platform that will eventually let users buy, sell, and trade virtual shoes and apparel.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458863/nike-nfts-happen-dot-swoosh-sneakers-crypto",
                    "author": {
                      "fullName": "Emma Roth",
                      "fullOrUserName": "Emma Roth",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/emma-roth",
                      },
                      "firstName": "Emma",
                      "lastName": "Roth",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T23:51:18.741Z",
                    "originalPublishDate": "2022-11-14T23:51:18.741Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/HmTOORPJVN94K8id5ZdXpCcImOA=/0x0:2768x1600/2768x1600/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/ZicktDwPdm3nYi64Mic9oMxeibU=/0x0:2768x1600/2400x1600/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "caption": null,
                        "asset": { "title": "The .Swoosh homepage" },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/HmTOORPJVN94K8id5ZdXpCcImOA=/0x0:2768x1600/2768x1600/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/kBpYMnV6G6hiQV4AtHdRHm2V20A=/0x0:2768x1600/2400x1920/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "caption": null,
                        "asset": { "title": "The .Swoosh homepage" },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/HmTOORPJVN94K8id5ZdXpCcImOA=/0x0:2768x1600/2768x1600/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/OxwgC2tKqeM386xjVdKNdsS2A6E=/0x0:2768x1600/2400x2400/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "caption": null,
                        "asset": { "title": "The .Swoosh homepage" },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/HmTOORPJVN94K8id5ZdXpCcImOA=/0x0:2768x1600/2768x1600/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/Kkd-oibPwN3zaG4yUfJ1AFROKx0=/0x0:2768x1600/2400x3429/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "caption": null,
                        "asset": { "title": "The .Swoosh homepage" },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/HmTOORPJVN94K8id5ZdXpCcImOA=/0x0:2768x1600/2768x1600/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/CxcGc3VVi1gfr3Kly_r2iJKFNac=/0x0:2768x1600/2400x1356/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
                        "caption": null,
                        "asset": { "title": "The .Swoosh homepage" },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:c927eb37-4c10-49d8-bef9-1ed9b594c4e2",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "business",
                      "uid": "EntryGroup:20237",
                      "name": "Business",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title": "The Tech Winter, visualized.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23459058/the-tech-winter-visualized",
                    "author": {
                      "fullName": "Sean Hollister",
                      "fullOrUserName": "Sean Hollister",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/sean-hollister",
                      },
                      "firstName": "Sean",
                      "lastName": "Hollister",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T23:10:06.107Z",
                    "originalPublishDate": "2022-11-14T23:10:06.107Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'The mass layoffs at Twitter, Meta, and soon possibly Amazon are <a href="https://www.theverge.com/2022/11/14/23458204/meta-twitter-amazon-apple-layoffs-hiring-freezes-latest-tech-industry">just the tip of the iceberg</a>. ',
                        },
                        "placement": { "id": "lK4BGo" },
                      }, {
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'Tech job marketplace <a href="http://TrueUp.io">TrueUp.io</a> has been keeping track — and it says over <em>183,000</em> people have already been hit by tech layoffs so far in 2022. You can see the details <a href="https://www.trueup.io/layoffs">in the company’s interactive tracker here</a>.',
                        },
                        "placement": { "id": "bAhXcn" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryImage",
                      "url":
                        "https://cdn.vox-cdn.com/thumbor/1avowB8oxBsaU2ohTUI_H4yx02Q=/0x0:775x787/775x787/filters:focal(321x297:322x298)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196953/chrome_rbXrHYrC3y.png",
                      "height": 787,
                      "width": 775,
                      "hideCredit": false,
                      "caption": null,
                      "credit": {
                        "html":
                          'Dataviz: <a href="https://www.trueup.io/layoffs">TrueUp.io/layoffs</a>',
                      },
                      "asset": { "title": null },
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:8cf6d479-f221-4099-8a30-e837dd9483db",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "android",
                      "uid": "EntryGroup:45037",
                      "name": "Android",
                      "isInternal": false,
                    }, {
                      "slug": "google",
                      "uid": "EntryGroup:55",
                      "name": "Google",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "wearables",
                      "uid": "EntryGroup:54403",
                      "name": "Wearable",
                      "isInternal": false,
                    }, {
                      "slug": "google-pixel",
                      "uid": "EntryGroup:62747",
                      "name": "Google Pixel",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title":
                      "The Pixel Watch companion app just got its first update.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458952/the-pixel-watch-companion-app-just-got-its-first-update",
                    "author": {
                      "fullName": "Richard Lawler",
                      "fullOrUserName": "Richard Lawler",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/richard-lawler",
                      },
                      "firstName": "Richard",
                      "lastName": "Lawler",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T23:02:16.111Z",
                    "originalPublishDate": "2022-11-14T23:02:16.111Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "One month after Google launched the Pixel Watch, its app is getting its first update. ",
                        },
                        "placement": { "id": "Pc2nko" },
                      }, {
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'The update is rolling out over the next few weeks, so you may not see it right away, but <a href="https://support.google.com/googlepixelwatch/thread/188595308/update-google-pixel-watch-app?hl=en">according to the support page</a>, the November 2022 update has some bug fixes, plus improvements like bringing access Fitbit sync information and integration settings to the home screen.',
                        },
                        "placement": { "id": "UUsTol" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryRelatedEntry",
                      "entry": {
                        "type": "STORY",
                        "uuid": "8154a3a3-9c19-4b3d-b892-37c66c8271f9",
                        "title":
                          "Google Pixel Watch review: it’s a smarter Fitbit",
                        "promoHeadline": null,
                        "url":
                          "https://www.theverge.com/23400779/google-pixel-watch-review-wear-os-smartwatch-wearable-fitbit",
                        "author": {
                          "fullOrUserName": "Victoria Song",
                          "authorProfile": {
                            "url":
                              "https://www.theverge.com/authors/victoria-song",
                          },
                          "fullName": "Victoria Song",
                        },
                        "contributors": [],
                        "__isEntryRevision": "Entry",
                        "publishDate": "2022-10-12T17:00:00.000Z",
                        "originalPublishDate": "2022-10-12T17:00:00.000Z",
                        "community": {
                          "placeholderImageUrl":
                            "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                        },
                        "communityGroups": [
                          { "slug": "front-page" },
                          { "slug": "reviews" },
                          { "slug": "guidebook" },
                          { "slug": "tech" },
                          { "slug": "smartwatch-review" },
                          { "slug": "smartwatch" },
                          { "slug": "wearables" },
                          { "slug": "google" },
                          { "slug": "fitness-trackers" },
                          { "slug": "featured-story" },
                        ],
                        "standard": null,
                        "fivefour": null,
                        "square": null,
                        "portrait": null,
                        "landscape": null,
                        "customPages": null,
                        "leadComponent": {
                          "__typename": "EntryLeadImage",
                          "standard": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/qrg19C-JHOSTsNgONUq1hKcMw10=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/tvSyQMRRcervGzgyy9JjuntMtzo=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "caption": {
                              "plaintext":
                                "There’s a lot to like about the Pixel Watch, but it’s clearly a first-gen device.",
                            },
                            "asset": {
                              "title":
                                "Pixel Watch on top of a Pixel 7 and Pixel 7 Pro",
                            },
                          },
                          "fivefour": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/qrg19C-JHOSTsNgONUq1hKcMw10=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/q4LwYwMQJakaKhwGQXAYfRkfIzk=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "caption": {
                              "plaintext":
                                "There’s a lot to like about the Pixel Watch, but it’s clearly a first-gen device.",
                            },
                            "asset": {
                              "title":
                                "Pixel Watch on top of a Pixel 7 and Pixel 7 Pro",
                            },
                          },
                          "square": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/qrg19C-JHOSTsNgONUq1hKcMw10=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/XkM5B5FuACliKf2kZhb_9eG6Jxs=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "caption": {
                              "plaintext":
                                "There’s a lot to like about the Pixel Watch, but it’s clearly a first-gen device.",
                            },
                            "asset": {
                              "title":
                                "Pixel Watch on top of a Pixel 7 and Pixel 7 Pro",
                            },
                          },
                          "portrait": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/qrg19C-JHOSTsNgONUq1hKcMw10=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/nJU1bSrbI3dtdVlWpKbi6Nk-X3M=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "caption": {
                              "plaintext":
                                "There’s a lot to like about the Pixel Watch, but it’s clearly a first-gen device.",
                            },
                            "asset": {
                              "title":
                                "Pixel Watch on top of a Pixel 7 and Pixel 7 Pro",
                            },
                          },
                          "landscape": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/qrg19C-JHOSTsNgONUq1hKcMw10=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/CMVy9tkAEjWQHs5yKFh42_UPU7w=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24100797/226336_Pixel_Watch_AKrales_0058.jpg",
                            "caption": {
                              "plaintext":
                                "There’s a lot to like about the Pixel Watch, but it’s clearly a first-gen device.",
                            },
                            "asset": {
                              "title":
                                "Pixel Watch on top of a Pixel 7 and Pixel 7 Pro",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                { "placeable": null },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:2248a555-7cf1-4b38-9f17-9891557b8bda",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "labor",
                      "uid": "EntryGroup:102992",
                      "name": "Labor",
                      "isInternal": false,
                    }, {
                      "slug": "policy",
                      "uid": "EntryGroup:59",
                      "name": "Policy",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "amazon",
                      "uid": "EntryGroup:45265",
                      "name": "Amazon",
                      "isInternal": false,
                    }, {
                      "slug": "meta",
                      "uid": "EntryGroup:110650",
                      "name": "Meta",
                      "isInternal": false,
                    }, {
                      "slug": "cryptocurrency",
                      "uid": "EntryGroup:71007",
                      "name": "Crypto",
                      "isInternal": false,
                    }, {
                      "slug": "facebook",
                      "uid": "EntryGroup:45295",
                      "name": "Facebook",
                      "isInternal": false,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "elon-musk",
                      "uid": "EntryGroup:76615",
                      "name": "Elon Musk",
                      "isInternal": false,
                    }, {
                      "slug": "apps",
                      "uid": "EntryGroup:58",
                      "name": "Apps",
                      "isInternal": false,
                    }, {
                      "slug": "disney",
                      "uid": "EntryGroup:45303",
                      "name": "Disney",
                      "isInternal": false,
                    }, {
                      "slug": "business",
                      "uid": "EntryGroup:20237",
                      "name": "Business",
                      "isInternal": false,
                    }, {
                      "slug": "google",
                      "uid": "EntryGroup:55",
                      "name": "Google",
                      "isInternal": false,
                    }],
                    "type": "STREAM",
                    "title":
                      "The tech industry’s moment of reckoning: layoffs and hiring freezes",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Over the past few months, the economy has started to turn, and tech workers are being hit hard. Meta, Twitter, and more have fired thousands, and others are slowing or freezing hiring.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458204/meta-twitter-amazon-apple-layoffs-hiring-freezes-latest-tech-industry",
                    "author": {
                      "fullName": "Mitchell Clark",
                      "fullOrUserName": "Mitchell Clark",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/mitchell-clark",
                      },
                      "firstName": "Mitchell",
                      "lastName": "Clark",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T22:44:13.372Z",
                    "originalPublishDate": "2022-11-14T22:44:13.372Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/V0cyIZSLnKAS5K4jL1euouVOF6k=/0x0:1020x676/1020x676/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/N9PPeY1JQXasgVrwgXtnIno5ucc=/0x0:1020x676/2400x1600/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "caption": {
                          "plaintext": "Companies have been cutting costs.",
                        },
                        "asset": {
                          "title":
                            "Photo of a keyboard with a thumbs down button.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/V0cyIZSLnKAS5K4jL1euouVOF6k=/0x0:1020x676/1020x676/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/vtixxlldhImtbP3-LfkYt32GbJY=/0x0:1020x676/2400x1920/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "caption": {
                          "plaintext": "Companies have been cutting costs.",
                        },
                        "asset": {
                          "title":
                            "Photo of a keyboard with a thumbs down button.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/V0cyIZSLnKAS5K4jL1euouVOF6k=/0x0:1020x676/1020x676/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/PO1tO8NVPkJBTa4P4CH_DjPGYxM=/0x0:1020x676/2400x2400/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "caption": {
                          "plaintext": "Companies have been cutting costs.",
                        },
                        "asset": {
                          "title":
                            "Photo of a keyboard with a thumbs down button.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/V0cyIZSLnKAS5K4jL1euouVOF6k=/0x0:1020x676/1020x676/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/YxzO1aSp2IMJZryFKVgxtUDQ988=/0x0:1020x676/2400x3429/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "caption": {
                          "plaintext": "Companies have been cutting costs.",
                        },
                        "asset": {
                          "title":
                            "Photo of a keyboard with a thumbs down button.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/V0cyIZSLnKAS5K4jL1euouVOF6k=/0x0:1020x676/1020x676/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/H4mUdQRUaUedAds4oMMiNIvtTwk=/0x0:1020x676/2400x1356/filters:focal(510x338:511x339)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196839/facebookthumbsdong.jpg",
                        "caption": {
                          "plaintext": "Companies have been cutting costs.",
                        },
                        "asset": {
                          "title":
                            "Photo of a keyboard with a thumbs down button.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyHeading" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:520a9fb3-0b97-4636-9699-a48b57220ef2",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "energy",
                      "uid": "EntryGroup:45043",
                      "name": "Energy",
                      "isInternal": false,
                    }, {
                      "slug": "science",
                      "uid": "EntryGroup:16061",
                      "name": "Science",
                      "isInternal": false,
                    }, {
                      "slug": "policy",
                      "uid": "EntryGroup:59",
                      "name": "Policy",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "climate-change",
                      "uid": "EntryGroup:94925",
                      "name": "Climate",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "California updates proposal on solar incentives that reduces costs but pays less",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The state is working to reform the previous proposal that made solar hard to afford for lower-income households but, in turn, will tank the grid sell-back rates in what some groups are calling a ‘hidden tax.’",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457902/california-clean-energy-solar-incentives-net-metering-proposal-changes",
                    "author": {
                      "fullName": "Umar Shakir",
                      "fullOrUserName": "Umar Shakir",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/umar-shakir",
                      },
                      "firstName": "Umar",
                      "lastName": "Shakir",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T22:31:19.644Z",
                    "originalPublishDate": "2022-11-14T22:31:19.644Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/XPNzVhggekpVXxRHcw2MjaguNOw=/0x0:5982x3987/5982x3987/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/DM_Zc5fsEAZOlih8La0RxFgkJV8=/0x0:5982x3987/2400x1600/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "caption": {
                          "plaintext":
                            "A solar panel installation by Californian solar company Sunrun.",
                        },
                        "asset": {
                          "title":
                            "California could avoid rolling blackouts by helping more people install batteries",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/XPNzVhggekpVXxRHcw2MjaguNOw=/0x0:5982x3987/5982x3987/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/mOxC7dgVVxqQ8O-OBOgr5mnki6w=/0x0:5982x3987/2400x1920/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "caption": {
                          "plaintext":
                            "A solar panel installation by Californian solar company Sunrun.",
                        },
                        "asset": {
                          "title":
                            "California could avoid rolling blackouts by helping more people install batteries",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/XPNzVhggekpVXxRHcw2MjaguNOw=/0x0:5982x3987/5982x3987/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/J9QthgAY6melv7pdyvkEqXCl5Qo=/0x0:5982x3987/2400x2400/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "caption": {
                          "plaintext":
                            "A solar panel installation by Californian solar company Sunrun.",
                        },
                        "asset": {
                          "title":
                            "California could avoid rolling blackouts by helping more people install batteries",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/XPNzVhggekpVXxRHcw2MjaguNOw=/0x0:5982x3987/5982x3987/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/JImK5ybd6LCejXrXGEslm5rpCfU=/0x0:5982x3987/2400x3429/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "caption": {
                          "plaintext":
                            "A solar panel installation by Californian solar company Sunrun.",
                        },
                        "asset": {
                          "title":
                            "California could avoid rolling blackouts by helping more people install batteries",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/XPNzVhggekpVXxRHcw2MjaguNOw=/0x0:5982x3987/5982x3987/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/x5WIvZ194FpkqvRu-htSeXi7-YY=/0x0:5982x3987/2400x1356/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
                        "caption": {
                          "plaintext":
                            "A solar panel installation by Californian solar company Sunrun.",
                        },
                        "asset": {
                          "title":
                            "California could avoid rolling blackouts by helping more people install batteries",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "California is revisiting proposed solar incentives that make panels expensive to operate",
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:25835444-c2df-432c-a74d-ad64e63532d7",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "gadgets",
                      "uid": "EntryGroup:56257",
                      "name": "Gadgets",
                      "isInternal": false,
                    }, {
                      "slug": "smart-home",
                      "uid": "EntryGroup:60",
                      "name": "Smart Home",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "TP-Link is going straight to Wi-Fi 7 with its latest generation of routers",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The company’s latest collection of routers includes the newly designed Archer BE900 quad-band router for $700 and an upcoming GE800 gaming router.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458207/tp-link-wifi-7-archer-be900-ge800-gaming-deco-be95-be85-mesh-routers",
                    "author": {
                      "fullName": "Umar Shakir",
                      "fullOrUserName": "Umar Shakir",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/umar-shakir",
                      },
                      "firstName": "Umar",
                      "lastName": "Shakir",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T22:04:21.991Z",
                    "originalPublishDate": "2022-11-14T22:04:21.991Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6MTJrNcN74Zf5TVFORQ_BJ1YaIY=/0x0:2162x1441/2162x1441/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/O4qHzjyaddpMZjLubN25P510BIo=/0x0:2162x1441/2400x1600/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "caption": {
                          "plaintext":
                            "The new Archer BE900 has a touchscreen and LED lights that can display stats and fun things like emoji.",
                        },
                        "asset": {
                          "title":
                            "The TP Link Archer is a metallic and CPU looking tower with led lights in the front and a touchscreen on the bottom with the time 9:41.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6MTJrNcN74Zf5TVFORQ_BJ1YaIY=/0x0:2162x1441/2162x1441/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/mxn9zPaXRBu_MaSneVVsIbAUBqM=/0x0:2162x1441/2400x1920/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "caption": {
                          "plaintext":
                            "The new Archer BE900 has a touchscreen and LED lights that can display stats and fun things like emoji.",
                        },
                        "asset": {
                          "title":
                            "The TP Link Archer is a metallic and CPU looking tower with led lights in the front and a touchscreen on the bottom with the time 9:41.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6MTJrNcN74Zf5TVFORQ_BJ1YaIY=/0x0:2162x1441/2162x1441/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/K5LLQEkfxy-ZdSZ-D_7PxrMTXXk=/0x0:2162x1441/2400x2400/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "caption": {
                          "plaintext":
                            "The new Archer BE900 has a touchscreen and LED lights that can display stats and fun things like emoji.",
                        },
                        "asset": {
                          "title":
                            "The TP Link Archer is a metallic and CPU looking tower with led lights in the front and a touchscreen on the bottom with the time 9:41.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6MTJrNcN74Zf5TVFORQ_BJ1YaIY=/0x0:2162x1441/2162x1441/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/yLMIjsm4tViAMF6wSq1VpE5tk1Y=/0x0:2162x1441/2400x3429/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "caption": {
                          "plaintext":
                            "The new Archer BE900 has a touchscreen and LED lights that can display stats and fun things like emoji.",
                        },
                        "asset": {
                          "title":
                            "The TP Link Archer is a metallic and CPU looking tower with led lights in the front and a touchscreen on the bottom with the time 9:41.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6MTJrNcN74Zf5TVFORQ_BJ1YaIY=/0x0:2162x1441/2162x1441/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/nfwk9VYB3LJx6goZLU36nP4L06Y=/0x0:2162x1441/2400x1356/filters:focal(1081x721:1082x722)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196398/Screenshot_2022_11_14_at_1.04.10_PM.jpeg",
                        "caption": {
                          "plaintext":
                            "The new Archer BE900 has a touchscreen and LED lights that can display stats and fun things like emoji.",
                        },
                        "asset": {
                          "title":
                            "The TP Link Archer is a metallic and CPU looking tower with led lights in the front and a touchscreen on the bottom with the time 9:41.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "TP-Link jumps to Wi-Fi 7 with new Archer and Deco mesh routers",
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:f2750bb4-5219-4bd8-a1ea-e2c92203ab93",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "nasa",
                      "uid": "EntryGroup:52487",
                      "name": "NASA",
                      "isInternal": false,
                    }, {
                      "slug": "space",
                      "uid": "EntryGroup:43698",
                      "name": "Space",
                      "isInternal": false,
                    }, {
                      "slug": "science",
                      "uid": "EntryGroup:16061",
                      "name": "Science",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "NASA’s Space Launch System rocket weathers the storm",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The rocket is currently on track for launch later this week. ",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458735/nasa-space-launch-system-nicole-rocket-artemis-1",
                    "author": {
                      "fullName": "Georgina Torbet",
                      "fullOrUserName": "Georgina Torbet",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/georgina-torbet",
                      },
                      "firstName": "Georgina",
                      "lastName": "Torbet",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T21:32:43.111Z",
                    "originalPublishDate": "2022-11-14T21:32:43.111Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZxTe2U-TXr4bY66a8jvpXxVQMNI=/0x0:3000x2000/3000x2000/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/y7dDRMYwssebYasEXI1M4ef3Jqg=/0x0:3000x2000/2400x1600/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "caption": {
                          "plaintext":
                            "The Orion capsule and Space Launch System on November 13th, 2022.",
                        },
                        "asset": {
                          "title":
                            "NASA Prepares For Artemis Moon Mission Launch",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZxTe2U-TXr4bY66a8jvpXxVQMNI=/0x0:3000x2000/3000x2000/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/us3oy5MvqpclqlsVJycl-51W2xA=/0x0:3000x2000/2400x1920/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "caption": {
                          "plaintext":
                            "The Orion capsule and Space Launch System on November 13th, 2022.",
                        },
                        "asset": {
                          "title":
                            "NASA Prepares For Artemis Moon Mission Launch",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZxTe2U-TXr4bY66a8jvpXxVQMNI=/0x0:3000x2000/3000x2000/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/5iJBa5bv099GffMFxddSV1bSQGA=/0x0:3000x2000/2400x2400/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "caption": {
                          "plaintext":
                            "The Orion capsule and Space Launch System on November 13th, 2022.",
                        },
                        "asset": {
                          "title":
                            "NASA Prepares For Artemis Moon Mission Launch",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZxTe2U-TXr4bY66a8jvpXxVQMNI=/0x0:3000x2000/3000x2000/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/OhHQRxStXKoUpx4XPBdPknoFhWQ=/0x0:3000x2000/2400x3429/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "caption": {
                          "plaintext":
                            "The Orion capsule and Space Launch System on November 13th, 2022.",
                        },
                        "asset": {
                          "title":
                            "NASA Prepares For Artemis Moon Mission Launch",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZxTe2U-TXr4bY66a8jvpXxVQMNI=/0x0:3000x2000/3000x2000/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/4C7Lb1a3Pdfj0t7HrrMQGBtDva8=/0x0:3000x2000/2400x1356/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
                        "caption": {
                          "plaintext":
                            "The Orion capsule and Space Launch System on November 13th, 2022.",
                        },
                        "asset": {
                          "title":
                            "NASA Prepares For Artemis Moon Mission Launch",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:211e51fb-80de-4839-9c99-b8909adb4bd9",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "reviews",
                      "uid": "EntryGroup:494",
                      "name": "Reviews",
                      "isInternal": false,
                    }, {
                      "slug": "guidebook",
                      "uid": "EntryGroup:79429",
                      "name": "guidebook",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "vr-virtual-reality",
                      "uid": "EntryGroup:45433",
                      "name": "Virtual Reality",
                      "isInternal": false,
                    }, {
                      "slug": "meta",
                      "uid": "EntryGroup:110650",
                      "name": "Meta",
                      "isInternal": false,
                    }, {
                      "slug": "vr-headset-review",
                      "uid": "EntryGroup:63437",
                      "name": "VR Headset Reviews",
                      "isInternal": false,
                    }, {
                      "slug": "featured-story",
                      "uid": "EntryGroup:63067",
                      "name": "Featured Stories",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title": "Meta Quest Pro review: get me out of here",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Meta’s $1,499 headset is better at showcasing VR’s weaknesses than its new strengths.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/23451629/meta-quest-pro-vr-headset-horizon-review",
                    "author": {
                      "fullName": "Adi Robertson",
                      "fullOrUserName": "Adi Robertson",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/adi-robertson",
                      },
                      "firstName": "Adi",
                      "lastName": "Robertson",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-11T15:30:00.000Z",
                    "originalPublishDate": "2022-11-11T15:30:00.000Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/K4wIiJdHT8l3UkpQKszqAbgZNA4=/0x0:2040x1360/2040x1360/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/XhDuLVAeDwdfp-OhL1F3xqPbm5Y=/0x0:2040x1360/2400x1600/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/K4wIiJdHT8l3UkpQKszqAbgZNA4=/0x0:2040x1360/2040x1360/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/Y3_yOlceWOb0FY8b3VDUJjlMjWc=/0x0:2040x1360/2400x1920/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/K4wIiJdHT8l3UkpQKszqAbgZNA4=/0x0:2040x1360/2040x1360/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/7EnNUzw43WiVrIp6w7C2G6oRgcc=/0x0:2040x1360/2400x2400/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/K4wIiJdHT8l3UkpQKszqAbgZNA4=/0x0:2040x1360/2040x1360/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/M_LLwo2SNGUZ-z7BlQ7J3Q3_eos=/0x0:2040x1360/2400x3429/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/K4wIiJdHT8l3UkpQKszqAbgZNA4=/0x0:2040x1360/2040x1360/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/tf49DnwdCriMwt6ZtGks2szr_WQ=/0x0:2040x1360/2400x1356/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        {
                          "__typename": "EntryBodyScorecard",
                          "scorecard": { "score": 4 },
                        },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImageGroup" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodySidebar" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:bbec19eb-b97b-4d3e-8d35-224dfac057a5",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }],
                    "type": "QUICK_POST",
                    "title": "Are you locked out of Twitter? Let us know.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458761/are-you-locked-out-of-twitter-let-us-know",
                    "author": {
                      "fullName": "Mitchell Clark",
                      "fullOrUserName": "Mitchell Clark",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/mitchell-clark",
                      },
                      "firstName": "Mitchell",
                      "lastName": "Clark",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T21:15:30.729Z",
                    "originalPublishDate": "2022-11-14T21:15:30.729Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'Just as Elon Musk says he’s <a href="https://twitter.com/elonmusk/status/1592177471654604800?s=20&t=9kYp4r9XX2I4RwabQnosIA">going to war on microservices</a>, <a href="https://twitter.com/Anthony/status/1592259767665397761">some Twitter users</a> are <a href="https://twitter.com/FairywrenTech/status/1592191371590631424">claiming</a> they’re not getting the two-factor codes that would <a href="https://twitter.com/broderick/status/1592250149748834305">let them log into the site</a>.',
                        },
                        "placement": { "id": "TnNx2w" },
                      }, {
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "We’ve tested it, and the system has worked for our accounts, but we’d love to hear from you — if you’re getting an error, email us at tips@theverge.com.",
                        },
                        "placement": { "id": "iQQmbW" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:f03ba279-ecf5-485e-9099-414033b8320d",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "google",
                      "uid": "EntryGroup:55",
                      "name": "Google",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "policy",
                      "uid": "EntryGroup:59",
                      "name": "Policy",
                      "isInternal": false,
                    }, {
                      "slug": "privacy",
                      "uid": "EntryGroup:79048",
                      "name": "Privacy",
                      "isInternal": false,
                    }, {
                      "slug": "law",
                      "uid": "EntryGroup:80480",
                      "name": "Law",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Google agrees to pay $392 million to settle location tracking investigation",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Google settled with 40 states over claims the company misled users into thinking they had location tracking turned off.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458460/google-392-million-settlement-location-tracking-lawsuit-attorneys-general",
                    "author": {
                      "fullName": "Emma Roth",
                      "fullOrUserName": "Emma Roth",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/emma-roth",
                      },
                      "firstName": "Emma",
                      "lastName": "Roth",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T21:09:06.149Z",
                    "originalPublishDate": "2022-11-14T21:09:06.149Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Y2cmykOJMVj97d2L8CsRd551rX8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/B4PUCYrYT2sV9Z9alHjbx3ysGvA=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "caption": null,
                        "asset": { "title": "Google logo" },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Y2cmykOJMVj97d2L8CsRd551rX8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/dIAFuXUbymStOyzhR90xFfHpjPg=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "caption": null,
                        "asset": { "title": "Google logo" },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Y2cmykOJMVj97d2L8CsRd551rX8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/kThV2HHKXAO1QhFPU09AJ-Hh3Fo=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "caption": null,
                        "asset": { "title": "Google logo" },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Y2cmykOJMVj97d2L8CsRd551rX8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/7v7ihxsUzNHg6EmLbYve-3EQDH8=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "caption": null,
                        "asset": { "title": "Google logo" },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Y2cmykOJMVj97d2L8CsRd551rX8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/DzWg8iZwlpX9wZdsEVKTEOPE_-E=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24016884/STK093_Google_05.jpg",
                        "caption": null,
                        "asset": { "title": "Google logo" },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyHTML" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:fe3c8e4c-e627-4fb7-aacb-2a7e5f4fc97e",
                    "communityGroups": [{
                      "slug": "tv",
                      "uid": "EntryGroup:32338",
                      "name": "TV Shows",
                      "isInternal": false,
                    }, {
                      "slug": "entertainment",
                      "uid": "EntryGroup:20485",
                      "name": "Entertainment",
                      "isInternal": false,
                    }, {
                      "slug": "music",
                      "uid": "EntryGroup:30982",
                      "name": "Music",
                      "isInternal": false,
                    }, {
                      "slug": "marvel",
                      "uid": "EntryGroup:45413",
                      "name": "Marvel",
                      "isInternal": false,
                    }, {
                      "slug": "streaming-wars",
                      "uid": "EntryGroup:80836",
                      "name": "Streaming",
                      "isInternal": false,
                    }, {
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Moon Girl and Devil Dinosaur’s theme song has no business being this good",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Disney’s upcoming Moon Girl and Devil Dinosaur animated series has a theme song that puts most of Marvel’s live-action music to shame.",
                    },
                    "promoDescription": {
                      "html":
                        "Disney’s upcoming Moon Girl and Devil Dinosaur animated series has one hell of a theme song.",
                    },
                    "url":
                      "https://www.theverge.com/2022/11/14/23273274/marvel-moon-girl-magic-devil-dinosaur",
                    "author": {
                      "fullName": "Charles Pulliam-Moore",
                      "fullOrUserName": "Charles Pulliam-Moore",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/charles-pulliam-moore",
                      },
                      "firstName": "Charles",
                      "lastName": "Pulliam-Moore",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T21:01:24.485Z",
                    "originalPublishDate": "2022-11-14T21:01:24.485Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": {
                      "url":
                        "https://cdn.vox-cdn.com/thumbor/fbosD1FyGM5yzpWaCuAYLF3URXo=/0x0:2880x1611/2880x1611/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "variantUrl":
                        "https://cdn.vox-cdn.com/thumbor/ASCvhMZY8J-Ea-x-8KIyURAZLFY=/0x0:2880x1611/2400x1600/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "caption": {
                        "plaintext":
                          "Devil Dinosaur hanging out while Moon Girl gets ready to jump into action.",
                      },
                      "asset": {
                        "title":
                          "A girl squatting down in her cluttered bedroom where a massive red T. rex is curled up watching television with a makeshift juice box.",
                      },
                    },
                    "fivefour": {
                      "url":
                        "https://cdn.vox-cdn.com/thumbor/fbosD1FyGM5yzpWaCuAYLF3URXo=/0x0:2880x1611/2880x1611/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "variantUrl":
                        "https://cdn.vox-cdn.com/thumbor/ssSOyyDHLv24oDchCN3Q4ZNMK2Q=/0x0:2880x1611/2400x1920/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "caption": {
                        "plaintext":
                          "Devil Dinosaur hanging out while Moon Girl gets ready to jump into action.",
                      },
                      "asset": {
                        "title":
                          "A girl squatting down in her cluttered bedroom where a massive red T. rex is curled up watching television with a makeshift juice box.",
                      },
                    },
                    "square": {
                      "url":
                        "https://cdn.vox-cdn.com/thumbor/fbosD1FyGM5yzpWaCuAYLF3URXo=/0x0:2880x1611/2880x1611/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "variantUrl":
                        "https://cdn.vox-cdn.com/thumbor/jH1MdtG1zpvaAaKuVCcEoFiPf2M=/0x0:2880x1611/2400x2400/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "caption": {
                        "plaintext":
                          "Devil Dinosaur hanging out while Moon Girl gets ready to jump into action.",
                      },
                      "asset": {
                        "title":
                          "A girl squatting down in her cluttered bedroom where a massive red T. rex is curled up watching television with a makeshift juice box.",
                      },
                    },
                    "portrait": {
                      "url":
                        "https://cdn.vox-cdn.com/thumbor/fbosD1FyGM5yzpWaCuAYLF3URXo=/0x0:2880x1611/2880x1611/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "variantUrl":
                        "https://cdn.vox-cdn.com/thumbor/Vl-O1OoH2_SJhKQfZHnX1Jb1Hac=/0x0:2880x1611/2400x3429/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "caption": {
                        "plaintext":
                          "Devil Dinosaur hanging out while Moon Girl gets ready to jump into action.",
                      },
                      "asset": {
                        "title":
                          "A girl squatting down in her cluttered bedroom where a massive red T. rex is curled up watching television with a makeshift juice box.",
                      },
                    },
                    "landscape": {
                      "url":
                        "https://cdn.vox-cdn.com/thumbor/fbosD1FyGM5yzpWaCuAYLF3URXo=/0x0:2880x1611/2880x1611/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "variantUrl":
                        "https://cdn.vox-cdn.com/thumbor/CBsAtTkgLKWvcbpScfjoFFY3kMo=/0x0:2880x1611/2400x1356/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
                      "caption": {
                        "plaintext":
                          "Devil Dinosaur hanging out while Moon Girl gets ready to jump into action.",
                      },
                      "asset": {
                        "title":
                          "A girl squatting down in her cluttered bedroom where a massive red T. rex is curled up watching television with a makeshift juice box.",
                      },
                    },
                    "leadComponent": { "__typename": "EntryLeadEmbed" },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": null,
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:d6aefb2c-9e6a-40a5-a72d-1fb16f9a8685",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "elon-musk",
                      "uid": "EntryGroup:76615",
                      "name": "Elon Musk",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title":
                      "Elon says “exceptional” performers at Twitter will be rewarded with stock options.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458713/elon-says-exceptional-performers-at-twitter-will-be-rewarded-with-stock-options",
                    "author": {
                      "fullName": "Alex Heath",
                      "fullOrUserName": "Alex Heath",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/alex-heath",
                      },
                      "firstName": "Alex",
                      "lastName": "Heath",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T20:42:36.038Z",
                    "originalPublishDate": "2022-11-14T20:42:36.038Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "Like at SpaceX — another privately owned Musk company — some employees will get stock as compensation, which could be lucrative if the company ever goes public again. Here’s the memo Musk just sent to staff:",
                        },
                        "placement": { "id": "W2eXaC" },
                      }, {
                        "__typename": "EntryBodyBlockquote",
                        "paragraphs": [{
                          "placement": { "id": "xeQU5l" },
                          "contents": { "html": "Twitter Stock &amp; Options" },
                        }, {
                          "placement": { "id": "CdlB4h" },
                          "contents": {
                            "html":
                              "Even though Twitter is now a private company, we absolutely will continue to provide stock and options as part of our ongoing compensation plan!",
                          },
                        }, {
                          "placement": { "id": "cho8I2" },
                          "contents": {
                            "html":
                              "The stock plan will be much like that of SpaceX, which has been very successful. As with SpaceX, exceptional amounts of stock will be awarded for exceptional performance.",
                          },
                        }, {
                          "placement": { "id": "WRCvKP" },
                          "contents": { "html": "Thanks," },
                        }, {
                          "placement": { "id": "XhRFwP" },
                          "contents": { "html": "Elon" },
                        }],
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:3f375dd4-dff2-4a95-ac6e-3587a1f841a0",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "toys",
                      "uid": "EntryGroup:106735",
                      "name": "Toys",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Nerf’s first League of Legends blaster is a $170 dart-flinging fish",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The latest in Nerf’s cosplay-grade line of branded Nerf LMTD blasters is the Jinx Fishbone, which shoots three darts at a time from its 18-dart revolving barrel. ",
                    },
                    "promoDescription": {
                      "html":
                        "League of Legends’ Jinx is the first to get their game gun Nerf’d.",
                    },
                    "url":
                      "https://www.theverge.com/2022/11/14/23458443/nerf-league-of-legends-riot-jinx-fishbones-lmtd-price-release-date",
                    "author": {
                      "fullName": "Sean Hollister",
                      "fullOrUserName": "Sean Hollister",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/sean-hollister",
                      },
                      "firstName": "Sean",
                      "lastName": "Hollister",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T20:41:17.958Z",
                    "originalPublishDate": "2022-11-14T20:41:17.958Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZEd8FNZoRyUBdugb_nqC2bNjPSc=/0x0:1500x1500/1500x1500/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/fOq6V8ZduqK6WyJNFJKDTDLyCT4=/0x0:1500x1500/2400x1600/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "caption": {
                          "plaintext":
                            "This is not a photo; Hasbro’s only sharing digital renders of the product. ﻿",
                        },
                        "asset": {
                          "title":
                            "Purple metal shark armor around a rocket launcher, is what it looks like",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZEd8FNZoRyUBdugb_nqC2bNjPSc=/0x0:1500x1500/1500x1500/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/38MUc9Aqi9P1sBMVKYudrG0Pc8s=/0x0:1500x1500/2400x1920/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "caption": {
                          "plaintext":
                            "This is not a photo; Hasbro’s only sharing digital renders of the product. ﻿",
                        },
                        "asset": {
                          "title":
                            "Purple metal shark armor around a rocket launcher, is what it looks like",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZEd8FNZoRyUBdugb_nqC2bNjPSc=/0x0:1500x1500/1500x1500/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/lmGTMODk-DkCc9vItIRxaXwbfLE=/0x0:1500x1500/2400x2400/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "caption": {
                          "plaintext":
                            "This is not a photo; Hasbro’s only sharing digital renders of the product. ﻿",
                        },
                        "asset": {
                          "title":
                            "Purple metal shark armor around a rocket launcher, is what it looks like",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZEd8FNZoRyUBdugb_nqC2bNjPSc=/0x0:1500x1500/1500x1500/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/X_3We5ffiUr0G0wNaobf-p1y-U4=/0x0:1500x1500/2400x3429/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "caption": {
                          "plaintext":
                            "This is not a photo; Hasbro’s only sharing digital renders of the product. ﻿",
                        },
                        "asset": {
                          "title":
                            "Purple metal shark armor around a rocket launcher, is what it looks like",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/ZEd8FNZoRyUBdugb_nqC2bNjPSc=/0x0:1500x1500/1500x1500/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/BcT7HZYvX1Qjb3Q3OeWJkJ2hFKA=/0x0:1500x1500/2400x1356/filters:focal(750x750:751x751)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195993/71AKnPBtXPL._AC_SL1500_.jpg",
                        "caption": {
                          "plaintext":
                            "This is not a photo; Hasbro’s only sharing digital renders of the product. ﻿",
                        },
                        "asset": {
                          "title":
                            "Purple metal shark armor around a rocket launcher, is what it looks like",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:1ef601c5-2bc1-4b13-b887-e1ca1dccbe04",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "black-friday",
                      "uid": "EntryGroup:22101",
                      "name": "Black Friday 2022",
                      "isInternal": false,
                    }, {
                      "slug": "black-friday-cyber-monday-2022-ads",
                      "uid": "EntryGroup:111482",
                      "name": "Black Friday Cyber Monday 2022 ads ",
                      "isInternal": true,
                    }, {
                      "slug": "good-deals",
                      "uid": "EntryGroup:473",
                      "name": "Deals",
                      "isInternal": false,
                    }, {
                      "slug": "guidebook",
                      "uid": "EntryGroup:79429",
                      "name": "guidebook",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "gadgets",
                      "uid": "EntryGroup:56257",
                      "name": "Gadgets",
                      "isInternal": false,
                    }],
                    "type": "PACKAGE",
                    "title": "The Verge’s Guide to Black Friday 2022",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "With a bit of insight, you can score the best deals and navigate the month-long sales event like a total pro",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/23437426/black-friday-guide-cyber-monday-tech-gadgets-2022",
                    "author": {
                      "fullName": "Brandon Widder",
                      "fullOrUserName": "Brandon Widder",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/brandon-widder",
                      },
                      "firstName": "Brandon",
                      "lastName": "Widder",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-03T15:00:00.000Z",
                    "originalPublishDate": "2022-11-03T15:00:00.000Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/F4gZ4cdPCtjQv3qVNpKPCOOu9ME=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/4ovI-dpATpsgBpODxxY9xDY4HBU=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/F4gZ4cdPCtjQv3qVNpKPCOOu9ME=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/mcLSGllQKTKSftzRe2F_d1ZtWOk=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/F4gZ4cdPCtjQv3qVNpKPCOOu9ME=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/sjddUD88_Id6NeS-H_QSPY4wUpc=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/F4gZ4cdPCtjQv3qVNpKPCOOu9ME=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/dl6u2HmT2NPU6Qo4iFOCMBMzg0c=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/F4gZ4cdPCtjQv3qVNpKPCOOu9ME=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/LegD1YErlLgQq9oRK4q23YRKGs0=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24165252/226389_Black_Friday_Cyber_Monday_Square_WJoel.jpg",
                        "caption": null,
                        "asset": { "title": null },
                      },
                    },
                    "body": {
                      "components": [{ "__typename": "EntryBodyParagraph" }, {
                        "__typename": "EntryBodyParagraph",
                      }, { "__typename": "EntryBodyParagraph" }],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "Black Friday and Cyber Monday 2022: The Verge’s guide to the best deals",
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:28dd3ce1-e67e-4710-bd53-65d90feb1411",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "health",
                      "uid": "EntryGroup:45041",
                      "name": "Health",
                      "isInternal": false,
                    }, {
                      "slug": "science",
                      "uid": "EntryGroup:16061",
                      "name": "Science",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title": "We could have a vaccine against RSV soon.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458633/we-could-have-a-vaccine-against-rsv-soon",
                    "author": {
                      "fullName": "Richard Lawler",
                      "fullOrUserName": "Richard Lawler",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/richard-lawler",
                      },
                      "firstName": "Richard",
                      "lastName": "Lawler",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [{
                      "fullOrUserName": "Nicole Wetsman",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/nicole-wetsman",
                      },
                    }],
                    "publishDate": "2022-11-14T20:13:36.357Z",
                    "originalPublishDate": "2022-11-14T20:13:36.357Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "As temperatures drop, covid, flu, and respiratory syncytial virus  (RSV) are all getting more people sick. There are vaccines available for two of those diseases, but despite decades of research, there hasn’t been a way to protect against RSV, a respiratory illness that can cause serious illness, especially in young infants.",
                        },
                        "placement": { "id": "4YJoQc" },
                      }, {
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "However, as Nicole Wetsman explains, that might be different next year.",
                        },
                        "placement": { "id": "ASi0t0" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryEmbed",
                      "embedHtml":
                        '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@seeker/video/7164152714996337962" data-video-id="7164152714996337962" data-embed-from="oembed" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@seeker" href="https://www.tiktok.com/@seeker?refer=embed">@seeker</a> <p>We could finally have an RSV vaccine by next fall. <a title="rsv" target="_blank" href="https://www.tiktok.com/tag/rsv?refer=embed">#RSV</a> <a title="vaccine" target="_blank" href="https://www.tiktok.com/tag/vaccine?refer=embed">#Vaccine</a> <a title="pfizer" target="_blank" href="https://www.tiktok.com/tag/pfizer?refer=embed">#Pfizer</a> <a title="respiratorysyncytialvirus" target="_blank" href="https://www.tiktok.com/tag/respiratorysyncytialvirus?refer=embed">#RespiratorySyncytialVirus</a> <a title="health" target="_blank" href="https://www.tiktok.com/tag/health?refer=embed">#Health</a> <a title="rsvvaccine" target="_blank" href="https://www.tiktok.com/tag/rsvvaccine?refer=embed">#RSVVaccine</a> <a title="biotech" target="_blank" href="https://www.tiktok.com/tag/biotech?refer=embed">#Biotech</a> <a title="healthcare" target="_blank" href="https://www.tiktok.com/tag/healthcare?refer=embed">#Healthcare</a> <a title="pediatrics" target="_blank" href="https://www.tiktok.com/tag/pediatrics?refer=embed">#Pediatrics</a> </p> <a target="_blank" title="♬ original sound - Seeker by The Verge" href="https://www.tiktok.com/music/original-sound-7164152732272659242?refer=embed">♬ original sound - Seeker by The Verge</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>',
                      "provider": { "name": "TikTok" },
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:690d71d2-df8f-4676-8d90-ce75f7b5fa5f",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "climate-change",
                      "uid": "EntryGroup:94925",
                      "name": "Climate",
                      "isInternal": false,
                    }, {
                      "slug": "energy",
                      "uid": "EntryGroup:45043",
                      "name": "Energy",
                      "isInternal": false,
                    }, {
                      "slug": "science",
                      "uid": "EntryGroup:16061",
                      "name": "Science",
                      "isInternal": false,
                    }, {
                      "slug": "environment",
                      "uid": "EntryGroup:45045",
                      "name": "Environment",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Oil giant Occidental wants to remake itself as a climate tech leader in Texas",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Occidental stands to profit off both its oil business and the pollution that it creates by building massive carbon removal projects in Texas.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23451865/occidental-oil-direct-air-capture-carbon-texas",
                    "author": {
                      "fullName": "Justine Calma",
                      "fullOrUserName": "Justine Calma",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/justine-calma",
                      },
                      "firstName": "Justine",
                      "lastName": "Calma",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T19:18:27.502Z",
                    "originalPublishDate": "2022-11-14T19:18:27.502Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/4evFydFrNZLTlUzx2R9QJyM936U=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/AK0od3aamVXxPBEDWJiBfWJGYjs=/0x0:3000x2000/2400x1600/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "caption": {
                          "plaintext":
                            "An oil pumpjack pulls oil from the Permian Basin oil field on March 14th, 2022.",
                        },
                        "asset": {
                          "title":
                            "An oil pumpjack in the shadows as the sun sets.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/4evFydFrNZLTlUzx2R9QJyM936U=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/P17Frdkg6wF6uJR0uRXAPZ0DlJE=/0x0:3000x2000/2400x1920/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "caption": {
                          "plaintext":
                            "An oil pumpjack pulls oil from the Permian Basin oil field on March 14th, 2022.",
                        },
                        "asset": {
                          "title":
                            "An oil pumpjack in the shadows as the sun sets.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/4evFydFrNZLTlUzx2R9QJyM936U=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/emfg46bFS2lpbt_Nl0x5H1MasTM=/0x0:3000x2000/2400x2400/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "caption": {
                          "plaintext":
                            "An oil pumpjack pulls oil from the Permian Basin oil field on March 14th, 2022.",
                        },
                        "asset": {
                          "title":
                            "An oil pumpjack in the shadows as the sun sets.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/4evFydFrNZLTlUzx2R9QJyM936U=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/UvVuQenHLM0vSzX-fPJOiDhGkZc=/0x0:3000x2000/2400x3429/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "caption": {
                          "plaintext":
                            "An oil pumpjack pulls oil from the Permian Basin oil field on March 14th, 2022.",
                        },
                        "asset": {
                          "title":
                            "An oil pumpjack in the shadows as the sun sets.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/4evFydFrNZLTlUzx2R9QJyM936U=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/NMCdwaDK5H1gcIEPEdi4DPrGXZc=/0x0:3000x2000/2400x1356/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
                        "caption": {
                          "plaintext":
                            "An oil pumpjack pulls oil from the Permian Basin oil field on March 14th, 2022.",
                        },
                        "asset": {
                          "title":
                            "An oil pumpjack in the shadows as the sun sets.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:faddb88c-0c89-41e8-953b-eef787bf80c7",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "amazon",
                      "uid": "EntryGroup:45265",
                      "name": "Amazon",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "business",
                      "uid": "EntryGroup:20237",
                      "name": "Business",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title":
                      "Gee, wonder why Jeff Bezos just announced he’d maybe possibly give away the majority of his fortune someday?",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458239/gee-wonder-why-jeff-bezos-just-announced-hed-maybe-possibly-give-away-the-majority-of-his-fortune-so",
                    "author": {
                      "fullName": "Sean Hollister",
                      "fullOrUserName": "Sean Hollister",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/sean-hollister",
                      },
                      "firstName": "Sean",
                      "lastName": "Hollister",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T17:45:58.990Z",
                    "originalPublishDate": "2022-11-14T17:45:58.990Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'Could it have something to do with how the world’s-fourth-richest-man’s company is reportedly about to announce the biggest job cuts in its history, leaving 10,000 people out of work amidst crippling inflation while he sits on <a href="https://www.theverge.com/c/22264856/jeff-bezos-worth-amazon-founder-ceo-193-billion-dollars">enough money to end hunger in the United States many times over</a>? ',
                        },
                        "placement": { "id": "S6AHH8" },
                      }, {
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'Because Bezos <em>certainly</em> doesn’t seem to have been all that interested in philanthropy before: this is the <a href="https://www.vanityfair.com/news/2022/02/mackenzie-scott-jeff-bezos-charitable-giving">notorious cheapskate</a> who “donated” $200 million to the Smithsonian Air and Space Museum <em>in exchange for 50-year naming rights</em> and <a href="https://www.marketwatch.com/story/jeff-bezos-name-will-be-displayed-on-a-new-building-at-the-national-air-and-space-museum-for-at-least-50-years-in-exchange-for-200-million-donation-11643325621?mod=hp_minor_pos25">they can’t even take his name off if he does something despicable</a>. ',
                        },
                        "placement": { "id": "M9qUY9" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryRelatedEntry",
                      "entry": {
                        "type": "STORY",
                        "uuid": "90183e58-f692-4654-8430-3162edc1aecf",
                        "title":
                          "Amazon mass layoffs will reportedly ax 10,000 people this week",
                        "promoHeadline": null,
                        "url":
                          "https://www.theverge.com/2022/11/14/23458097/amazon-layoffs-expected-10000-employees",
                        "author": {
                          "fullOrUserName": "Chris Welch",
                          "authorProfile": {
                            "url":
                              "https://www.theverge.com/authors/chris-welch",
                          },
                          "fullName": "Chris Welch",
                        },
                        "contributors": [],
                        "__isEntryRevision": "Entry",
                        "publishDate": "2022-11-14T17:20:20.700Z",
                        "originalPublishDate": "2022-11-14T17:20:20.700Z",
                        "community": {
                          "placeholderImageUrl":
                            "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                        },
                        "communityGroups": [
                          { "slug": "front-page" },
                          { "slug": "amazon" },
                          { "slug": "tech" },
                          { "slug": "news" },
                          { "slug": "business" },
                        ],
                        "standard": null,
                        "fivefour": null,
                        "square": null,
                        "portrait": null,
                        "landscape": null,
                        "customPages": null,
                        "leadComponent": {
                          "__typename": "EntryLeadImage",
                          "standard": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/1Cj0nMoygsL5slofq6ebteo-188=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "caption": null,
                            "asset": {
                              "title":
                                "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                            },
                          },
                          "fivefour": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/cOcunEuAe4MxGlfROo6rmqO82R0=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "caption": null,
                            "asset": {
                              "title":
                                "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                            },
                          },
                          "square": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/o0F2eB7kNxxkM6em-HOljqqzD2k=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "caption": null,
                            "asset": {
                              "title":
                                "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                            },
                          },
                          "portrait": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/TcIs-cQf3raJsOl0FfAstfk8l5Y=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "caption": null,
                            "asset": {
                              "title":
                                "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                            },
                          },
                          "landscape": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/Ct45l8__-Ufc82Le514tayOiGCM=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                            "caption": null,
                            "asset": {
                              "title":
                                "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:31c86b53-5d6b-46d4-bee8-958251fdeea0",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "good-deals",
                      "uid": "EntryGroup:473",
                      "name": "Deals",
                      "isInternal": false,
                    }, {
                      "slug": "guidebook",
                      "uid": "EntryGroup:79429",
                      "name": "guidebook",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "The desk-friendly 42-inch LG C2 OLED is cheaper than ever",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Right now, you can get $400 off the C2 OLED TV at Best Buy, in addition to some excellent deals on Garmin wearables and Google Nest Wifi mesh network systems.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457786/lg-c2-oled-google-mesh-garmin-smartwatch-jbl-deal-sale",
                    "author": {
                      "fullName": "Alice Newcome-Beill",
                      "fullOrUserName": "Alice Newcome-Beill",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/alice-newcome-beill",
                      },
                      "firstName": "Alice",
                      "lastName": "Newcome-Beill",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T17:44:12.613Z",
                    "originalPublishDate": "2022-11-14T17:44:12.613Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/9SGueMqOM7Bh2hbt_VWwhEWry0A=/665x223:4577x2648/3912x2425/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/tnezwWQTNcjZhix-Q4WCCbyS4Vo=/665x223:4577x2648/2400x1600/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "caption": {
                          "plaintext":
                            "The LG C2 has many of the same features as the C1 but is much lighter.",
                        },
                        "asset": {
                          "title":
                            "A stock photo of the home screen of the LG C2",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/9SGueMqOM7Bh2hbt_VWwhEWry0A=/665x223:4577x2648/3912x2425/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/PlFW5NP5R7lyY8jKJobCDOs2Aps=/665x223:4577x2648/2400x1920/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "caption": {
                          "plaintext":
                            "The LG C2 has many of the same features as the C1 but is much lighter.",
                        },
                        "asset": {
                          "title":
                            "A stock photo of the home screen of the LG C2",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/9SGueMqOM7Bh2hbt_VWwhEWry0A=/665x223:4577x2648/3912x2425/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/qCsLVrsX94_HoWKkvRdgrbrwMvk=/665x223:4577x2648/2400x2400/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "caption": {
                          "plaintext":
                            "The LG C2 has many of the same features as the C1 but is much lighter.",
                        },
                        "asset": {
                          "title":
                            "A stock photo of the home screen of the LG C2",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/9SGueMqOM7Bh2hbt_VWwhEWry0A=/665x223:4577x2648/3912x2425/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/UbobDCyRshfVjMsk3apRNYY1cwk=/665x223:4577x2648/2400x3429/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "caption": {
                          "plaintext":
                            "The LG C2 has many of the same features as the C1 but is much lighter.",
                        },
                        "asset": {
                          "title":
                            "A stock photo of the home screen of the LG C2",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/9SGueMqOM7Bh2hbt_VWwhEWry0A=/665x223:4577x2648/3912x2425/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/sE3k8UPqxYRBhLNxoGGk5fT5YJk=/665x223:4577x2648/2400x1356/filters:focal(2586x1409:2587x1410)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195623/6501500_rd.jpg",
                        "caption": {
                          "plaintext":
                            "The LG C2 has many of the same features as the C1 but is much lighter.",
                        },
                        "asset": {
                          "title":
                            "A stock photo of the home screen of the LG C2",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyProduct" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyProduct" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyProduct" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyProduct" },
                        { "__typename": "EntryBodyActionbox" },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyList" },
                        { "__typename": "EntryBodyNewsletter" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:b50517e5-945c-4502-9eb1-3f0ec74a7334",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "twitter",
                      "uid": "EntryGroup:45315",
                      "name": "Twitter",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title":
                      "Twitter didn’t respond to Eli Lilly about the fake insulin tweet for hours.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458276/twitter-didnt-respond-to-eli-lilly-about-the-fake-insulin-tweet-for-hours",
                    "author": {
                      "fullName": "Nilay Patel",
                      "fullOrUserName": "Nilay Patel",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/nilay-patel",
                      },
                      "firstName": "Nilay",
                      "lastName": "Patel",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T17:43:10.378Z",
                    "originalPublishDate": "2022-11-14T17:43:10.378Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'The pharma giant has suspended all of its Twitter accounts in the aftermath of <a href="https://www.theverge.com/2022/11/11/23454237/twitter-verified-moderation-parodies-slipping-through-advertisers">the scandal</a>, which wiped <a href="https://twitter.com/rafaelshimunov/status/1591133819918114816">billions from its market cap</a>.',
                        },
                        "placement": { "id": "WJNb4J" },
                      }, {
                        "__typename": "EntryBodyBlockquote",
                        "paragraphs": [{
                          "placement": { "id": "ntY5Eh" },
                          "contents": {
                            "html":
                              "Inside the real Eli Lilly, the fake sparked a panic, according to two people familiar with the matter who spoke on the condition of anonymity because they weren’t authorized to speak publicly. Company officials scrambled to contact Twitter representatives and demanded they kill the viral spoof, worried it could undermine their brand’s reputation or push false claims about people’s medicine. Twitter, its staffing cut in half, didn’t react for hours.",
                          },
                        }],
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryExternalLink",
                      "url":
                        "https://www.washingtonpost.com/technology/2022/11/14/twitter-fake-eli-lilly/",
                      "title":
                        "A fake tweet sparked panic at Eli Lilly and may have cost Twitter millions",
                      "source": "Washington Post",
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:88f13d3b-87ee-4a06-b906-8e24cc47a2a6",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "reviews",
                      "uid": "EntryGroup:494",
                      "name": "Reviews",
                      "isInternal": false,
                    }, {
                      "slug": "guidebook",
                      "uid": "EntryGroup:79429",
                      "name": "guidebook",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "lg",
                      "uid": "EntryGroup:54325",
                      "name": "LG",
                      "isInternal": false,
                    }, {
                      "slug": "tv-reviews",
                      "uid": "EntryGroup:26368",
                      "name": "TV Review",
                      "isInternal": false,
                    }, {
                      "slug": "tv",
                      "uid": "EntryGroup:32338",
                      "name": "TV Shows",
                      "isInternal": false,
                    }, {
                      "slug": "entertainment",
                      "uid": "EntryGroup:20485",
                      "name": "Entertainment",
                      "isInternal": false,
                    }, {
                      "slug": "featured-story",
                      "uid": "EntryGroup:63067",
                      "name": "Featured Stories",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title": "LG C2 OLED TV review: you can’t go wrong",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "It’s far from the brightest TV out there, but as the sweet spot in LG’s lineup, the C2 combines stunning picture quality with an exhaustive list of features and terrific gaming prowess.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/23453621/lg-c2-oled-tv-review",
                    "author": {
                      "fullName": "Chris Welch",
                      "fullOrUserName": "Chris Welch",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/chris-welch",
                      },
                      "firstName": "Chris",
                      "lastName": "Welch",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-13T14:00:00.000Z",
                    "originalPublishDate": "2022-11-13T14:00:00.000Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Ai9yliH3bWZLjXY5SdAndTYTVlM=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/LpqoLsGZW2dncROphherEAE4jX8=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "caption": null,
                        "asset": {
                          "title":
                            "A photo of LG’s 65-inch C2 OLED displaying its home screen.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Ai9yliH3bWZLjXY5SdAndTYTVlM=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/Y9uJ2yP0qXom53JWd9S9oQ_pC0s=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "caption": null,
                        "asset": {
                          "title":
                            "A photo of LG’s 65-inch C2 OLED displaying its home screen.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Ai9yliH3bWZLjXY5SdAndTYTVlM=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/EnoEiQgxVP9YOXWicDlxPUyhGFM=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "caption": null,
                        "asset": {
                          "title":
                            "A photo of LG’s 65-inch C2 OLED displaying its home screen.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Ai9yliH3bWZLjXY5SdAndTYTVlM=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/BbPMTtwKkgcmA3V_zcpWb7WMFQ8=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "caption": null,
                        "asset": {
                          "title":
                            "A photo of LG’s 65-inch C2 OLED displaying its home screen.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Ai9yliH3bWZLjXY5SdAndTYTVlM=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/21-f_UjFOu9KfqwpofiJH6Q_Lnw=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
                        "caption": null,
                        "asset": {
                          "title":
                            "A photo of LG’s 65-inch C2 OLED displaying its home screen.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        {
                          "__typename": "EntryBodyScorecard",
                          "scorecard": { "score": 8 },
                        },
                        { "__typename": "EntryBodyHeading" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImageGroup" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodySidebar" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:90183e58-f692-4654-8430-3162edc1aecf",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "amazon",
                      "uid": "EntryGroup:45265",
                      "name": "Amazon",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "business",
                      "uid": "EntryGroup:20237",
                      "name": "Business",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Amazon mass layoffs will reportedly ax 10,000 people this week",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The cuts would be the most significant in Amazon’s history and continue a wave of mass firings in the tech industry.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458097/amazon-layoffs-expected-10000-employees",
                    "author": {
                      "fullName": "Chris Welch",
                      "fullOrUserName": "Chris Welch",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/chris-welch",
                      },
                      "firstName": "Chris",
                      "lastName": "Welch",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T17:20:20.700Z",
                    "originalPublishDate": "2022-11-14T17:20:20.700Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/1Cj0nMoygsL5slofq6ebteo-188=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/cOcunEuAe4MxGlfROo6rmqO82R0=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/o0F2eB7kNxxkM6em-HOljqqzD2k=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/TcIs-cQf3raJsOl0FfAstfk8l5Y=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/Ct45l8__-Ufc82Le514tayOiGCM=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
                        "caption": null,
                        "asset": {
                          "title":
                            "Illustration showing Amazon’s logo on a black, orange, and tan background, formed by outlines of the letter “a.”",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:30622cc2-4483-4a68-8c4c-bd4c22c893cf",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "cryptocurrency",
                      "uid": "EntryGroup:71007",
                      "name": "Crypto",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "business",
                      "uid": "EntryGroup:20237",
                      "name": "Business",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Binance, Crypto.com execs tell investors to ‘ask me anything’ following the fall of FTX",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The CEOs for Binance and Crypto.com are suddenly emphasizing transparency, starting with some open online chats.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457819/binance-crypto-dot-com-investors-ama-ftx-flops",
                    "author": {
                      "fullName": "Emma Roth",
                      "fullOrUserName": "Emma Roth",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/emma-roth",
                      },
                      "firstName": "Emma",
                      "lastName": "Roth",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T17:13:38.658Z",
                    "originalPublishDate": "2022-11-14T17:13:38.658Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/dPyabav9MZE3W5sgF7SBQOVdTA4=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/H-71xOVuIIa5KjoeG6-ZgZxhiLc=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "caption": null,
                        "asset": { "title": "The Binance logo " },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/dPyabav9MZE3W5sgF7SBQOVdTA4=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/_7pHT9G21fhpxfvBpEnrwJFmUjk=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "caption": null,
                        "asset": { "title": "The Binance logo " },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/dPyabav9MZE3W5sgF7SBQOVdTA4=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/vQI8p_jiWXCWJX0b1ttAX6DVvNE=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "caption": null,
                        "asset": { "title": "The Binance logo " },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/dPyabav9MZE3W5sgF7SBQOVdTA4=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/qL05yxiI35Z3D5pSc02ycsGWMmo=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "caption": null,
                        "asset": { "title": "The Binance logo " },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/dPyabav9MZE3W5sgF7SBQOVdTA4=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/YZv3xT5GvN99M38dDUJslnTklKE=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951270/STK018_VRG_Illo_N_Barclay_13_BINANCE.jpg",
                        "caption": null,
                        "asset": { "title": "The Binance logo " },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline":
                      "Binance, Crypto.com execs tell investors to “ask me anything” following the fall of FTX",
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:11852645-0c13-49c4-bc7c-ed39c99110ce",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "good-deals",
                      "uid": "EntryGroup:473",
                      "name": "Deals",
                      "isInternal": false,
                    }, {
                      "slug": "guidebook",
                      "uid": "EntryGroup:79429",
                      "name": "guidebook",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "gift-guide",
                      "uid": "EntryGroup:472",
                      "name": "Gift Guide",
                      "isInternal": false,
                    }, {
                      "slug": "featured-story",
                      "uid": "EntryGroup:63067",
                      "name": "Featured Stories",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title": "The Verge Holiday Gift Guide 2022",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Check out our top gift ideas for the tech-savvy and non-techies alike.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/23435489/holiday-gift-guide-best-ideas-cool-tech",
                    "author": {
                      "fullName": "Verge Staff",
                      "fullOrUserName": "Verge Staff",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/verge-staff",
                      },
                      "firstName": "Verge",
                      "lastName": "Staff",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-07T15:30:00.000Z",
                    "originalPublishDate": "2022-11-07T15:30:00.000Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/yX0pwJiuZW9QU3z7S96N10lgvW0=/0x0:2538x1692/2538x1692/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/dKoLhLkBjux8GYYNYtsFp_1bzb8=/0x0:2538x1692/2400x1600/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/yX0pwJiuZW9QU3z7S96N10lgvW0=/0x0:2538x1692/2538x1692/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/vigtadsvgXmADB0PPsaUKYRVZI0=/0x0:2538x1692/2115x1692/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/yX0pwJiuZW9QU3z7S96N10lgvW0=/0x0:2538x1692/2538x1692/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/H4CbbiX4j0fJZGj8PUralIn_0GA=/0x0:2538x1692/1692x1692/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/yX0pwJiuZW9QU3z7S96N10lgvW0=/0x0:2538x1692/2538x1692/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/4H3bt5I3Dy5w6xVFsdOCrkvxFUs=/0x0:2538x1692/1184x1691/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/yX0pwJiuZW9QU3z7S96N10lgvW0=/0x0:2538x1692/2538x1692/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/l_boLySwazr9XRdCO_uvq13mfnk=/0x0:2538x1692/2400x1356/filters:focal(1269x846:1270x847):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/24166234/226333_HOLIDAYGIFTGUIDE_TABLESCAPE_01_jgoldberg.gif",
                        "caption": null,
                        "asset": { "title": null },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyTable" },
                        { "__typename": "EntryBodyHorizontalRule" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "The Verge Holiday Gift Guide 2022: tech gifts, gadgets, and more",
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:e32f2838-8fd9-48c4-8b80-f685aa8b86ed",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "tv",
                      "uid": "EntryGroup:32338",
                      "name": "TV Shows",
                      "isInternal": false,
                    }, {
                      "slug": "entertainment",
                      "uid": "EntryGroup:20485",
                      "name": "Entertainment",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "star-wars",
                      "uid": "EntryGroup:45017",
                      "name": "Star Wars",
                      "isInternal": false,
                    }, {
                      "slug": "film",
                      "uid": "EntryGroup:32340",
                      "name": "Film",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Andor’s first two episodes will air on TV over Thanksgiving",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Disney is bringing Andor to ABC, FX, and Freeform for special showings later this month. And if you have Hulu, you’ll be able to catch the episodes there, too.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458078/disney-star-wars-andor-first-two-episodes-broadcast-tv-abc-fx-freeform-hulu",
                    "author": {
                      "fullName": "Jay Peters",
                      "fullOrUserName": "Jay Peters",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/jay-peters",
                      },
                      "firstName": "Jay",
                      "lastName": "Peters",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T17:04:01.236Z",
                    "originalPublishDate": "2022-11-14T17:04:01.236Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/l6Q-rzRZiw5dEWyaetEph5jlU2A=/0x0:3840x1595/3840x1595/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/dUM7UtoToG4yPmo3NQ_gVWGb2UU=/0x0:3840x1595/2400x1600/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "caption": {
                          "plaintext":
                            "If you haven’t watched Andor yet, you should.",
                        },
                        "asset": {
                          "title":
                            "A man walking through a scrapyard where another man is busy working to collect metal from a wrecked ship.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/l6Q-rzRZiw5dEWyaetEph5jlU2A=/0x0:3840x1595/3840x1595/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/QSMEtADace6T0GHRUwZ_MO_8ihw=/0x0:3840x1595/2400x1920/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "caption": {
                          "plaintext":
                            "If you haven’t watched Andor yet, you should.",
                        },
                        "asset": {
                          "title":
                            "A man walking through a scrapyard where another man is busy working to collect metal from a wrecked ship.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/l6Q-rzRZiw5dEWyaetEph5jlU2A=/0x0:3840x1595/3840x1595/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/JFk9gtD9rJIkzXGTltxlK7uIkD0=/0x0:3840x1595/2400x2400/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "caption": {
                          "plaintext":
                            "If you haven’t watched Andor yet, you should.",
                        },
                        "asset": {
                          "title":
                            "A man walking through a scrapyard where another man is busy working to collect metal from a wrecked ship.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/l6Q-rzRZiw5dEWyaetEph5jlU2A=/0x0:3840x1595/3840x1595/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/aFyV64tDk7e5U8oEpBWpYV91TZc=/0x0:3840x1595/2400x3429/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "caption": {
                          "plaintext":
                            "If you haven’t watched Andor yet, you should.",
                        },
                        "asset": {
                          "title":
                            "A man walking through a scrapyard where another man is busy working to collect metal from a wrecked ship.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/l6Q-rzRZiw5dEWyaetEph5jlU2A=/0x0:3840x1595/3840x1595/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/WmvJmKZk35dAP62PB7ZzzHMjSE8=/0x0:3840x1595/2400x1356/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
                        "caption": {
                          "plaintext":
                            "If you haven’t watched Andor yet, you should.",
                        },
                        "asset": {
                          "title":
                            "A man walking through a scrapyard where another man is busy working to collect metal from a wrecked ship.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyList" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:7f14fe19-3fb1-43e5-9e5b-60790c793032",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "how-to",
                      "uid": "EntryGroup:475",
                      "name": "How to",
                      "isInternal": false,
                    }, {
                      "slug": "guidebook",
                      "uid": "EntryGroup:79429",
                      "name": "guidebook",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "microsoft-windows",
                      "uid": "EntryGroup:43472",
                      "name": "Windows",
                      "isInternal": false,
                    }, {
                      "slug": "microsoft",
                      "uid": "EntryGroup:54",
                      "name": "Microsoft",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title": "Stop giving your friends your Wi-Fi password.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458161/stop-giving-your-friends-your-wi-fi-password",
                    "author": {
                      "fullName": "Monica Chin",
                      "fullOrUserName": "Monica Chin",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/monica-chin",
                      },
                      "firstName": "Monica",
                      "lastName": "Chin",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T16:49:51.272Z",
                    "originalPublishDate": "2022-11-14T16:49:51.272Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "If you’re throwing a party and would prefer not to have dozens of very intoxicated guests running around with your internet credentials, you can set up your Windows PC as a router (with its own password) instead. Here’s how to do it in a few easy steps.",
                        },
                        "placement": { "id": "TfImQX" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryRelatedEntry",
                      "entry": {
                        "type": "STORY",
                        "uuid": "aa398c4a-f384-43eb-bc40-efe5d0ac22f9",
                        "title": "How to share your Wi-Fi on Windows 11",
                        "promoHeadline": null,
                        "url":
                          "https://www.theverge.com/23457864/windows-11-wifi-share-mobile-hotspot-how-to",
                        "author": {
                          "fullOrUserName": "Monica Chin",
                          "authorProfile": {
                            "url":
                              "https://www.theverge.com/authors/monica-chin",
                          },
                          "fullName": "Monica Chin",
                        },
                        "contributors": [],
                        "__isEntryRevision": "Entry",
                        "publishDate": "2022-11-14T16:25:36.419Z",
                        "originalPublishDate": "2022-11-14T16:25:36.419Z",
                        "community": {
                          "placeholderImageUrl":
                            "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                        },
                        "communityGroups": [
                          { "slug": "how-to" },
                          { "slug": "guidebook" },
                          { "slug": "tech" },
                          { "slug": "microsoft-windows" },
                          { "slug": "microsoft" },
                          { "slug": "laptops" },
                        ],
                        "standard": null,
                        "fivefour": null,
                        "square": null,
                        "portrait": null,
                        "landscape": null,
                        "customPages": null,
                        "leadComponent": {
                          "__typename": "EntryLeadImage",
                          "standard": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/7CKWLAnxAPAdxq2RMxgOV0L8nco=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/NQE8OVJTvbVfKQn4An06HswmpNg=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "caption": { "plaintext": "Sharing is caring." },
                            "asset": {
                              "title":
                                "A Surface Pro in laptop mode displaying the Windows Start menu sits over a collage background of cartoon Windows logos, keyboards, and screens.",
                            },
                          },
                          "fivefour": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/7CKWLAnxAPAdxq2RMxgOV0L8nco=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/TudnHODbxELKMNg5PpwOdIY4h9k=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "caption": { "plaintext": "Sharing is caring." },
                            "asset": {
                              "title":
                                "A Surface Pro in laptop mode displaying the Windows Start menu sits over a collage background of cartoon Windows logos, keyboards, and screens.",
                            },
                          },
                          "square": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/7CKWLAnxAPAdxq2RMxgOV0L8nco=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/rsyCyzHQSH91kiM5rW_QEkrP3Pc=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "caption": { "plaintext": "Sharing is caring." },
                            "asset": {
                              "title":
                                "A Surface Pro in laptop mode displaying the Windows Start menu sits over a collage background of cartoon Windows logos, keyboards, and screens.",
                            },
                          },
                          "portrait": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/7CKWLAnxAPAdxq2RMxgOV0L8nco=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/FmETT5vfjjHRiMyXs8WPmG4gCsY=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "caption": { "plaintext": "Sharing is caring." },
                            "asset": {
                              "title":
                                "A Surface Pro in laptop mode displaying the Windows Start menu sits over a collage background of cartoon Windows logos, keyboards, and screens.",
                            },
                          },
                          "landscape": {
                            "url":
                              "https://cdn.vox-cdn.com/thumbor/7CKWLAnxAPAdxq2RMxgOV0L8nco=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "variantUrl":
                              "https://cdn.vox-cdn.com/thumbor/-YMhB0nAMmQ4cJJjogOcaAv8MII=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23952502/HT030_windows_0008.jpg",
                            "caption": { "plaintext": "Sharing is caring." },
                            "asset": {
                              "title":
                                "A Surface Pro in laptop mode displaying the Windows Start menu sits over a collage background of cartoon Windows logos, keyboards, and screens.",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:88006401-2a90-41eb-ba1d-b149f3a91d30",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "games",
                      "uid": "EntryGroup:57",
                      "name": "Gaming",
                      "isInternal": false,
                    }, {
                      "slug": "entertainment",
                      "uid": "EntryGroup:20485",
                      "name": "Entertainment",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "microsoft",
                      "uid": "EntryGroup:54",
                      "name": "Microsoft",
                      "isInternal": false,
                    }, {
                      "slug": "microsoft-xbox",
                      "uid": "EntryGroup:62531",
                      "name": "Xbox",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Xbox transparency report reveals up to 4.78M accounts were proactively suspended in just six months",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The report contains data regarding player reports and proactive action taken by Microsoft to protect the gaming platforms’ user base.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457595/xbox-transparency-report-player-account-suspension",
                    "author": {
                      "fullName": "Jess Weatherbed",
                      "fullOrUserName": "Jess Weatherbed",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/jess-weatherbed",
                      },
                      "firstName": "Jess",
                      "lastName": "Weatherbed",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T16:30:00.000Z",
                    "originalPublishDate": "2022-11-14T16:30:00.000Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/udjt_3-Yful30Ibz1JFm_x0RPJM=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/rNfKmR6_L5sSLEAoLgB5q5yLkXs=/0x0:3000x2000/2400x1600/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "caption": {
                          "plaintext":
                            "The Digital Transparency Report contains data captured by Microsoft between January 1st and June 30th this year and provides information regarding content moderation and player safety.",
                        },
                        "asset": {
                          "title":
                            "The Microsoft Xbox game logo against a green and black background.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/udjt_3-Yful30Ibz1JFm_x0RPJM=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/oe6i22tqSU-WzCdOvxAkIECZ9qg=/0x0:3000x2000/2400x1920/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "caption": {
                          "plaintext":
                            "The Digital Transparency Report contains data captured by Microsoft between January 1st and June 30th this year and provides information regarding content moderation and player safety.",
                        },
                        "asset": {
                          "title":
                            "The Microsoft Xbox game logo against a green and black background.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/udjt_3-Yful30Ibz1JFm_x0RPJM=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/DDwmSLgWJun_KPhO8WCYILGrzwY=/0x0:3000x2000/2400x2400/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "caption": {
                          "plaintext":
                            "The Digital Transparency Report contains data captured by Microsoft between January 1st and June 30th this year and provides information regarding content moderation and player safety.",
                        },
                        "asset": {
                          "title":
                            "The Microsoft Xbox game logo against a green and black background.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/udjt_3-Yful30Ibz1JFm_x0RPJM=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/M8E63GffWnKPtzLmaa4yJPE-iKM=/0x0:3000x2000/2400x3429/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "caption": {
                          "plaintext":
                            "The Digital Transparency Report contains data captured by Microsoft between January 1st and June 30th this year and provides information regarding content moderation and player safety.",
                        },
                        "asset": {
                          "title":
                            "The Microsoft Xbox game logo against a green and black background.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/udjt_3-Yful30Ibz1JFm_x0RPJM=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/t4XEqr8ZeNmIOFiipXIU-qnKL7k=/0x0:3000x2000/2400x1356/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23926023/acastro_STK048_02.jpg",
                        "caption": {
                          "plaintext":
                            "The Digital Transparency Report contains data captured by Microsoft between January 1st and June 30th this year and provides information regarding content moderation and player safety.",
                        },
                        "asset": {
                          "title":
                            "The Microsoft Xbox game logo against a green and black background.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "Xbox proactively suspended up to 4.78M accounts in just six months",
                    "socialHeadline":
                      "Xbox proactively suspended up to 4.78M accounts this year",
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:9d0dd30d-76d6-4303-b1d2-ad7add702b2f",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "games",
                      "uid": "EntryGroup:57",
                      "name": "Gaming",
                      "isInternal": false,
                    }, {
                      "slug": "entertainment",
                      "uid": "EntryGroup:20485",
                      "name": "Entertainment",
                      "isInternal": false,
                    }, {
                      "slug": "pc-gaming",
                      "uid": "EntryGroup:75315",
                      "name": "PC Gaming",
                      "isInternal": false,
                    }, {
                      "slug": "microsoft-xbox",
                      "uid": "EntryGroup:62531",
                      "name": "Xbox",
                      "isInternal": false,
                    }, {
                      "slug": "sony-playstation",
                      "uid": "EntryGroup:62529",
                      "name": "PlayStation",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "The Witcher 3’s next-gen patch will arrive on December 14th",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The oft-delayed update for PC, PS5, and Xbox Series X / S consoles will finally show up in a month. If you already own the base game, it’ll be a free upgrade.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457988/witcher-3-ps5-xbox-series-x-s-upgrade-ray-tracing-release-date",
                    "author": {
                      "fullName": "Cameron Faulkner",
                      "fullOrUserName": "Cameron Faulkner",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/cameron-faulkner",
                      },
                      "firstName": "Cameron",
                      "lastName": "Faulkner",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T16:16:22.558Z",
                    "originalPublishDate": "2022-11-14T16:16:22.558Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/473MUKd-VuhB1qseIk2ZrzAYC98=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/nJLL8eW7v0RCJ_JGN9iLF2qnGjI=/0x0:2048x1152/2400x1600/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "caption": {
                          "plaintext":
                            "It’s free if you own the PC, PS4, or Xbox One version of the game.",
                        },
                        "asset": {
                          "title":
                            "The Witcher 3 next-gen release date is December 14th, 2022. This image shows the release date, along with a screenshot of Geralt riding on Roach the horse during a scenic sunset.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/473MUKd-VuhB1qseIk2ZrzAYC98=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/YqHGhxTgwIWYa1ajsQcasoWYUdY=/0x0:2048x1152/2400x1920/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "caption": {
                          "plaintext":
                            "It’s free if you own the PC, PS4, or Xbox One version of the game.",
                        },
                        "asset": {
                          "title":
                            "The Witcher 3 next-gen release date is December 14th, 2022. This image shows the release date, along with a screenshot of Geralt riding on Roach the horse during a scenic sunset.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/473MUKd-VuhB1qseIk2ZrzAYC98=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/lRvZRXytIcOAJJ-a-xBIVNzeJ9s=/0x0:2048x1152/2400x2400/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "caption": {
                          "plaintext":
                            "It’s free if you own the PC, PS4, or Xbox One version of the game.",
                        },
                        "asset": {
                          "title":
                            "The Witcher 3 next-gen release date is December 14th, 2022. This image shows the release date, along with a screenshot of Geralt riding on Roach the horse during a scenic sunset.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/473MUKd-VuhB1qseIk2ZrzAYC98=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/mnub7n2K8PIlmfIsBdxEKMp4xS4=/0x0:2048x1152/2400x3429/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "caption": {
                          "plaintext":
                            "It’s free if you own the PC, PS4, or Xbox One version of the game.",
                        },
                        "asset": {
                          "title":
                            "The Witcher 3 next-gen release date is December 14th, 2022. This image shows the release date, along with a screenshot of Geralt riding on Roach the horse during a scenic sunset.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/473MUKd-VuhB1qseIk2ZrzAYC98=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/fg7cRFsg5NzD91_O1KSNosHeUoY=/0x0:2048x1152/2400x1356/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
                        "caption": {
                          "plaintext":
                            "It’s free if you own the PC, PS4, or Xbox One version of the game.",
                        },
                        "asset": {
                          "title":
                            "The Witcher 3 next-gen release date is December 14th, 2022. This image shows the release date, along with a screenshot of Geralt riding on Roach the horse during a scenic sunset.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "The Witcher 3’s next-gen patch will arrive in December",
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:7c8b2072-e36b-4508-967d-682c940eba7d",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "android",
                      "uid": "EntryGroup:45037",
                      "name": "Android",
                      "isInternal": false,
                    }, {
                      "slug": "google",
                      "uid": "EntryGroup:55",
                      "name": "Google",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "health",
                      "uid": "EntryGroup:45041",
                      "name": "Health",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "apps",
                      "uid": "EntryGroup:58",
                      "name": "Apps",
                      "isInternal": false,
                    }, {
                      "slug": "wearables",
                      "uid": "EntryGroup:54403",
                      "name": "Wearable",
                      "isInternal": false,
                    }, {
                      "slug": "fitness-trackers",
                      "uid": "EntryGroup:54409",
                      "name": "Fitness",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Now Android fitness apps like Peloton and MyFitnessPal can share data via Health Connect",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Fitbit, Oura, and Flo are just a few of the other apps already integrated with the platform.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23458004/google-health-connect-fitness-tracking-api-beta",
                    "author": {
                      "fullName": "Jess Weatherbed",
                      "fullOrUserName": "Jess Weatherbed",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/jess-weatherbed",
                      },
                      "firstName": "Jess",
                      "lastName": "Weatherbed",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T16:01:30.982Z",
                    "originalPublishDate": "2022-11-14T16:01:30.982Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/U3-SPURv_2yqvPdyGj0sAKYl6mY=/0x0:3200x2300/3200x2300/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/wJsOU16tdwMcb0r05P74T08xu6M=/0x0:3200x2300/2400x1600/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "caption": {
                          "plaintext":
                            "The Health Connect platform can be used to sync data between fitness apps, simplifying app connectivity and centralizing privacy controls.",
                        },
                        "asset": {
                          "title":
                            "A collection of logos for health and fitness apps that integrate with Google Connect.",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/U3-SPURv_2yqvPdyGj0sAKYl6mY=/0x0:3200x2300/3200x2300/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/6rfOWwuduMl6lYcjKnoSzo4adsg=/0x0:3200x2300/2400x1920/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "caption": {
                          "plaintext":
                            "The Health Connect platform can be used to sync data between fitness apps, simplifying app connectivity and centralizing privacy controls.",
                        },
                        "asset": {
                          "title":
                            "A collection of logos for health and fitness apps that integrate with Google Connect.",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/U3-SPURv_2yqvPdyGj0sAKYl6mY=/0x0:3200x2300/3200x2300/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/kZJWCX1DQXeQBdt_Yuxtw1Y-vjU=/0x0:3200x2300/2400x2400/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "caption": {
                          "plaintext":
                            "The Health Connect platform can be used to sync data between fitness apps, simplifying app connectivity and centralizing privacy controls.",
                        },
                        "asset": {
                          "title":
                            "A collection of logos for health and fitness apps that integrate with Google Connect.",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/U3-SPURv_2yqvPdyGj0sAKYl6mY=/0x0:3200x2300/3200x2300/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/YOe1wSNv5dhjC7NUhIaaQlz132M=/0x0:3200x2300/2400x3429/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "caption": {
                          "plaintext":
                            "The Health Connect platform can be used to sync data between fitness apps, simplifying app connectivity and centralizing privacy controls.",
                        },
                        "asset": {
                          "title":
                            "A collection of logos for health and fitness apps that integrate with Google Connect.",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/U3-SPURv_2yqvPdyGj0sAKYl6mY=/0x0:3200x2300/3200x2300/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/qRt53ChJFX1UqOJazi-0uLYDYLI=/0x0:3200x2300/2400x1356/filters:focal(1600x1150:1601x1151)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195347/Health_Connect.jpg",
                        "caption": {
                          "plaintext":
                            "The Health Connect platform can be used to sync data between fitness apps, simplifying app connectivity and centralizing privacy controls.",
                        },
                        "asset": {
                          "title":
                            "A collection of logos for health and fitness apps that integrate with Google Connect.",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "Peloton, MyFitnessPal, and other Android fitness apps can now share data via Health Connect",
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:980a3dd8-e638-4fd2-9ba4-7d0428f5cf00",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "transportation",
                      "uid": "EntryGroup:29820",
                      "name": "Transpo",
                      "isInternal": false,
                    }, {
                      "slug": "google-waymo",
                      "uid": "EntryGroup:97700",
                      "name": "Waymo",
                      "isInternal": false,
                    }, {
                      "slug": "autonomous-cars",
                      "uid": "EntryGroup:67541",
                      "name": "Autonomous Cars",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Waymo’s robotaxis are basically mobile weather stations now",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Autonomous vehicles are notoriously bad at operating in inclement weather, so the Alphabet company developed a new metric to generate better estimates about conditions in foggy San Francisco.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23453478/waymo-av-autonomous-bad-weather-fog-sf-station",
                    "author": {
                      "fullName": "Andrew J. Hawkins",
                      "fullOrUserName": "Andrew J. Hawkins",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/andrew-j-hawkins",
                      },
                      "firstName": "Andrew J.",
                      "lastName": "Hawkins",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T16:00:00.000Z",
                    "originalPublishDate": "2022-11-14T16:00:00.000Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6B2plJPl7HnSeTbauiCQhCz684M=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/8pIIgw4jVnTLMuP46Qp9Xek8I84=/0x0:2048x1152/2400x1600/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6B2plJPl7HnSeTbauiCQhCz684M=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/8kT_1cEnMjfqy7eUgjPb9Er9blc=/0x0:2048x1152/2400x1920/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6B2plJPl7HnSeTbauiCQhCz684M=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/riveA6WCmUUFM9up7iX3e6huo4o=/0x0:2048x1152/2400x2400/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6B2plJPl7HnSeTbauiCQhCz684M=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/sTglaivtbf8Um80G4kOyBgPF_wI=/0x0:2048x1152/2400x3429/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "caption": null,
                        "asset": { "title": null },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/6B2plJPl7HnSeTbauiCQhCz684M=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/3GybsSOlpf7aV7DdyhZeak21E6k=/0x0:2048x1152/2400x1356/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195241/Waymo_Fog_11_21.png",
                        "caption": null,
                        "asset": { "title": null },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:2fa01fb5-17c7-4f89-b4a8-773c9a00729a",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "games",
                      "uid": "EntryGroup:57",
                      "name": "Gaming",
                      "isInternal": false,
                    }, {
                      "slug": "entertainment",
                      "uid": "EntryGroup:20485",
                      "name": "Entertainment",
                      "isInternal": false,
                    }, {
                      "slug": "nintendo",
                      "uid": "EntryGroup:62533",
                      "name": "Nintendo",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }],
                    "type": "STORY",
                    "title":
                      "Splatoon 3’s chill December update adds more of everything",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "Chill Season 2022 arrives just in time for you to zone out during those long and sometimes boring family holiday gatherings.",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457879/splatoon-3-chill-season-2022-update-nintendo-switch",
                    "author": {
                      "fullName": "Ash Parrish",
                      "fullOrUserName": "Ash Parrish",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/ash-parrish",
                      },
                      "firstName": "Ash",
                      "lastName": "Parrish",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T15:54:53.588Z",
                    "originalPublishDate": "2022-11-14T15:54:53.588Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/VtbZTIE9u_78faEUlzoOTRoUbLE=/0x0:1200x675/1200x675/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/mxxBda5-3s5EAz1toYoa5SXn7l0=/0x0:1200x675/2400x1600/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "caption": null,
                        "asset": {
                          "title":
                            "Graphic depicting three green octolings from Splatoon 3 over a background splattered with bright green paint and the words “Chill Season 2022” in the bottom-right corner",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/VtbZTIE9u_78faEUlzoOTRoUbLE=/0x0:1200x675/1200x675/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/c5tV-ZUwb5TUyV0NK3e2lG-AaeE=/0x0:1200x675/2400x1920/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "caption": null,
                        "asset": {
                          "title":
                            "Graphic depicting three green octolings from Splatoon 3 over a background splattered with bright green paint and the words “Chill Season 2022” in the bottom-right corner",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/VtbZTIE9u_78faEUlzoOTRoUbLE=/0x0:1200x675/1200x675/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/YRXrO-BS15_amXkQee0nDEqjN9w=/0x0:1200x675/2400x2400/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "caption": null,
                        "asset": {
                          "title":
                            "Graphic depicting three green octolings from Splatoon 3 over a background splattered with bright green paint and the words “Chill Season 2022” in the bottom-right corner",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/VtbZTIE9u_78faEUlzoOTRoUbLE=/0x0:1200x675/1200x675/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/9KrIIt61Cr75F-YHoUVE7nYAURQ=/0x0:1200x675/2400x3429/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "caption": null,
                        "asset": {
                          "title":
                            "Graphic depicting three green octolings from Splatoon 3 over a background splattered with bright green paint and the words “Chill Season 2022” in the bottom-right corner",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/VtbZTIE9u_78faEUlzoOTRoUbLE=/0x0:1200x675/1200x675/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/o0pX-TNHWt_v0XodB5MAcDQKxeM=/0x0:1200x675/2400x1356/filters:focal(674x282:675x283)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195301/unnamed.png",
                        "caption": null,
                        "asset": {
                          "title":
                            "Graphic depicting three green octolings from Splatoon 3 over a background splattered with bright green paint and the words “Chill Season 2022” in the bottom-right corner",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyEmbed" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:ff47642d-d14b-43f4-b0eb-7b3ea62e88b8",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "transportation",
                      "uid": "EntryGroup:29820",
                      "name": "Transpo",
                      "isInternal": false,
                    }, {
                      "slug": "tesla",
                      "uid": "EntryGroup:45247",
                      "name": "Tesla",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title":
                      "Tesla is planning a delivery event for its electric Semi trucks on December 1st.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457961/tesla-is-planning-a-delivery-event-for-its-electric-semi-trucks-on-december-1st",
                    "author": {
                      "fullName": "Andrew J. Hawkins",
                      "fullOrUserName": "Andrew J. Hawkins",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/andrew-j-hawkins",
                      },
                      "firstName": "Andrew J.",
                      "lastName": "Hawkins",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T15:35:31.682Z",
                    "originalPublishDate": "2022-11-14T15:35:31.682Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            'According to <em>Electrek</em>, the event is likely to focus on handing over the first Semi trucks to customers, one of which is <a href="https://www.theverge.com/2022/10/6/23391923/tesla-semi-truck-delivered-pepsi-production-december">expected to be Pepsi</a>. Previously, Tesla CEO Elon Musk said the company wouldn’t unveil any new vehicles as it works to ramp up production for its existing vehicles, as well as pre-production for the Semi and Cybertruck. ',
                        },
                        "placement": { "id": "Ks1Mnb" },
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryExternalLink",
                      "url":
                        "https://electrek.co/2022/11/14/tesla-semi-event-deliveries-dec-1st/",
                      "title":
                        "Tesla to hold rare event for Tesla Semi deliveries on Dec. 1",
                      "source": "Electrek",
                    },
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:da1946d0-0054-4ce2-98d8-71070e4d9ab9",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "gadgets",
                      "uid": "EntryGroup:56257",
                      "name": "Gadgets",
                      "isInternal": false,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "news",
                      "uid": "EntryGroup:79217",
                      "name": "News",
                      "isInternal": true,
                    }, {
                      "slug": "smart-home",
                      "uid": "EntryGroup:60",
                      "name": "Smart Home",
                      "isInternal": false,
                    }, {
                      "slug": "exclusive",
                      "uid": "EntryGroup:466",
                      "name": "Exclusive",
                      "isInternal": false,
                    }],
                    "type": "STORY",
                    "title":
                      "Schlage’s current Apple Home Key smart lock will not support Matter",
                    "promoHeadline": null,
                    "dek": {
                      "html":
                        "The company cites speed of adoption and changes in the new smart home standard as reasons its Encode Plus smart lock won’t get upgraded to Matter. It plans to release a new Matter-enabled smart lock in the future. ",
                    },
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457732/schlage-apple-home-key-smart-lock-upgrade-matter",
                    "author": {
                      "fullName": "Jennifer Pattison Tuohy",
                      "fullOrUserName": "Jennifer Pattison Tuohy",
                      "authorProfile": {
                        "url":
                          "https://www.theverge.com/authors/jennifer-tuohy",
                      },
                      "firstName": "Jennifer",
                      "lastName": "Pattison Tuohy",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T15:28:01.704Z",
                    "originalPublishDate": "2022-11-14T15:28:01.704Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": {
                      "__typename": "EntryLeadImage",
                      "standard": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Rq1AyMqHmFjJ7zvw_BZSNARXNj8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/orFA7gAaTrO-qjuU9YQWDp6AOxo=/0x0:2040x1360/2400x1600/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "caption": {
                          "plaintext":
                            "The Schlage Encode Plus is one of the few smart locks with support for both Apple Home Key and Thread.",
                        },
                        "asset": {
                          "title": "A smart door lock on a front door",
                        },
                      },
                      "fivefour": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Rq1AyMqHmFjJ7zvw_BZSNARXNj8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/1XIof1owU6gOnC2Mm5Jwnb3VUX4=/0x0:2040x1360/2400x1920/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "caption": {
                          "plaintext":
                            "The Schlage Encode Plus is one of the few smart locks with support for both Apple Home Key and Thread.",
                        },
                        "asset": {
                          "title": "A smart door lock on a front door",
                        },
                      },
                      "square": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Rq1AyMqHmFjJ7zvw_BZSNARXNj8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/is9jWS7eMBJECzP17MvbmdELN44=/0x0:2040x1360/2400x2400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "caption": {
                          "plaintext":
                            "The Schlage Encode Plus is one of the few smart locks with support for both Apple Home Key and Thread.",
                        },
                        "asset": {
                          "title": "A smart door lock on a front door",
                        },
                      },
                      "portrait": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Rq1AyMqHmFjJ7zvw_BZSNARXNj8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/mRKxs3RMtsboaGXLCa4UKLl0xjs=/0x0:2040x1360/2400x3429/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "caption": {
                          "plaintext":
                            "The Schlage Encode Plus is one of the few smart locks with support for both Apple Home Key and Thread.",
                        },
                        "asset": {
                          "title": "A smart door lock on a front door",
                        },
                      },
                      "landscape": {
                        "url":
                          "https://cdn.vox-cdn.com/thumbor/Rq1AyMqHmFjJ7zvw_BZSNARXNj8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "variantUrl":
                          "https://cdn.vox-cdn.com/thumbor/kiInq_b_PnPRd8aKyDKMH2VqX4c=/0x0:2040x1360/2400x1356/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23241986/dseifert_220211_5018_0005.jpg",
                        "caption": {
                          "plaintext":
                            "The Schlage Encode Plus is one of the few smart locks with support for both Apple Home Key and Thread.",
                        },
                        "asset": {
                          "title": "A smart door lock on a front door",
                        },
                      },
                    },
                    "body": {
                      "components": [
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyRelatedList" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyImage" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodySidebar" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyPullquote" },
                        { "__typename": "EntryBodyParagraph" },
                        { "__typename": "EntryBodyParagraph" },
                      ],
                      "quickPostComponents": [],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline":
                      "Schlage Encode Plus smart lock will not work with Matter",
                    "socialHeadline":
                      "Apple Home Key smart lock the Schlage Encode Plus won’t be upgraded to Matter",
                    "quickAttachment": null,
                  },
                },
                {
                  "placeable": {
                    "__typename": "Entry",
                    "uid": "Entry:e3f74907-58df-482b-b8e7-5a932303aff5",
                    "communityGroups": [{
                      "slug": "front-page",
                      "uid": "EntryGroup:51",
                      "name": "Front Page",
                      "isInternal": false,
                    }, {
                      "slug": "quick-post",
                      "uid": "EntryGroup:110142",
                      "name": "Quickposts",
                      "isInternal": true,
                    }, {
                      "slug": "tech",
                      "uid": "EntryGroup:21019",
                      "name": "Tech",
                      "isInternal": false,
                    }, {
                      "slug": "tiktok",
                      "uid": "EntryGroup:91917",
                      "name": "TikTok",
                      "isInternal": false,
                    }],
                    "type": "QUICK_POST",
                    "title":
                      "You should read this fun and surprising story about how tech affects our sleep.",
                    "promoHeadline": null,
                    "dek": null,
                    "promoDescription": null,
                    "url":
                      "https://www.theverge.com/2022/11/14/23457875/you-should-read-this-fun-and-surprising-story-about-how-tech-affects-our-sleep",
                    "author": {
                      "fullName": "David Pierce",
                      "fullOrUserName": "David Pierce",
                      "authorProfile": {
                        "url": "https://www.theverge.com/authors/david-pierce",
                      },
                      "firstName": "David",
                      "lastName": "Pierce",
                    },
                    "customPages": null,
                    "__isEntryRevision": "Entry",
                    "package": null,
                    "contributors": [],
                    "publishDate": "2022-11-14T15:19:02.097Z",
                    "originalPublishDate": "2022-11-14T15:19:02.097Z",
                    "linkPostCommunity": null,
                    "community": {
                      "placeholderImageUrl":
                        "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
                    },
                    "standard": null,
                    "fivefour": null,
                    "square": null,
                    "portrait": null,
                    "landscape": null,
                    "leadComponent": null,
                    "body": {
                      "components": [],
                      "quickPostComponents": [{
                        "__typename": "EntryBodyParagraph",
                        "contents": {
                          "html":
                            "Is it all perfect science? Definitely not. But there’s a <em>ton </em>of interesting info in here about how blue lights and infinite algorithms change our sleep — plus some helpfully simple advice. Watch bad TV, not bad TikTok!",
                        },
                        "placement": { "id": "0fQjDR" },
                      }, {
                        "__typename": "EntryBodyBlockquote",
                        "paragraphs": [{
                          "placement": { "id": "MxIUJP" },
                          "contents": {
                            "html":
                              "The worst types of media to absorb before bed are those that have no “stopping point” — Instagram, TikTok, shows designed to be binge-watched. If you intend to binge a show, that might be fine: “Making a plan and sticking to it seems to matter,” she says.",
                          },
                        }],
                      }],
                    },
                    "primaryCommunityGroup": { "name": "Front Page" },
                    "seoHeadline": null,
                    "socialHeadline": null,
                    "quickAttachment": {
                      "__typename": "EntryExternalLink",
                      "url":
                        "https://www.vulture.com/article/is-falling-asleep-to-tv-really-so-bad.html",
                      "title": "Bed Habits",
                      "source": "Vulture",
                    },
                  },
                },
              ],
            },
          },
          "cellData": {
            "prestoComponentData": {
              "live_now": true,
              "masthead_bg_image":
                "https://cdn2.vox-cdn.com/uploads/chorus_asset/file/7383221/Masthead_VW_2.0.png",
              "masthead_foreground_color": "white",
              "masthead_tagline": "X-37B is back.",
              "masthead_tagline_url":
                "https://www.theverge.com/2022/11/13/23456718/space-force-x-37b-spaceplane-returns-two-years-falconsat-8",
              "communities_pinned": false,
              "nav_items": [{
                "title": "Tech",
                "url": "/tech",
                "pinned": true,
                "all_link": { "title": "All Tech", "url": "/tech" },
                "sub_items": [
                  { "title": "Video", "url": "https://goo.gl/G5RXGs" },
                  {
                    "title": "Amazon",
                    "url": "/amazon",
                    "supplemental": false,
                    "group_id": 45265,
                  },
                  { "title": "Apple", "url": "/apple", "group_id": 52 },
                  {
                    "title": "Facebook",
                    "url": "/facebook",
                    "group_id": 45295,
                  },
                  {
                    "title": "Google",
                    "url": "/google",
                    "supplemental": false,
                    "group_id": 55,
                  },
                  { "title": "Microsoft", "url": "/microsoft", "group_id": 54 },
                  {
                    "title": "Samsung",
                    "url": "/samsung",
                    "supplemental": false,
                    "group_id": 45339,
                  },
                  { "title": "Tesla", "url": "/tesla-motors" },
                  {
                    "title": "AI",
                    "url": "/ai-artificial-intelligence",
                    "group_id": 45647,
                  },
                  { "title": "Cars", "url": "/cars", "group_id": 45235 },
                  {
                    "title": "Cybersecurity",
                    "url": "/cyber-security",
                    "group_id": 45395,
                  },
                  {
                    "title": "Mobile",
                    "url": "/mobile",
                    "supplemental": false,
                    "group_id": 63,
                  },
                  {
                    "title": "Policy",
                    "url": "/policy",
                    "supplemental": false,
                    "group_id": 59,
                  },
                  {
                    "title": "Privacy",
                    "url": "/privacy",
                    "supplemental": false,
                    "group_id": 79048,
                  },
                  {
                    "title": "Scooters",
                    "url": "/scooters",
                    "supplemental": false,
                    "group_id": 79035,
                  },
                ],
                "group_id": 21019,
              }, {
                "title": "Reviews",
                "url": "/reviews",
                "pinned": false,
                "all_link": {
                  "title": "More from Verge Reviews",
                  "url": "/reviews",
                },
                "sub_items": [
                  {
                    "title": "Phones",
                    "url": "/phone-review",
                    "group_id": 63411,
                  },
                  {
                    "title": "Laptops",
                    "url": "/laptop-review",
                    "group_id": 63413,
                  },
                  {
                    "title": "Headphones",
                    "url": "/headphone-review",
                    "group_id": 63419,
                  },
                  {
                    "title": "Cameras",
                    "url": "/camera-review",
                    "group_id": 63415,
                  },
                  {
                    "title": "Tablets",
                    "url": "/tablet-review",
                    "group_id": 63417,
                  },
                  {
                    "title": "Smartwatches",
                    "url": "/smartwatch-review",
                    "group_id": 63421,
                  },
                  {
                    "title": "Speakers",
                    "url": "/speaker-review",
                    "supplemental": false,
                    "group_id": 63425,
                  },
                  {
                    "title": "Drones",
                    "url": "/drone-review",
                    "supplemental": false,
                    "group_id": 63439,
                  },
                  {
                    "title": "Accessories",
                    "url": "/tech-accessory-review",
                    "supplemental": false,
                    "group_id": 66991,
                  },
                  {
                    "title": "Buying Guides",
                    "url": "/this-is-my-next",
                    "group_id": 25617,
                  },
                  { "title": "How-tos", "url": "/how-to", "group_id": 475 },
                  {
                    "title": "Deals",
                    "url": "/good-deals",
                    "supplemental": false,
                    "group_id": 473,
                  },
                ],
                "group_id": 494,
              }, {
                "title": "Science",
                "url": "/science",
                "pinned": true,
                "all_link": { "title": "All Science", "url": "/science" },
                "sub_items": [
                  {
                    "title": "Video",
                    "url": "http://bit.ly/2FqJZMl",
                    "supplemental": false,
                  },
                  { "title": "Space", "url": "/space", "group_id": 43698 },
                  {
                    "title": "NASA",
                    "url": "/nasa",
                    "supplemental": false,
                    "group_id": 52487,
                  },
                  {
                    "title": "SpaceX",
                    "url": "/spacex",
                    "supplemental": false,
                    "group_id": 52485,
                  },
                  { "title": "Health", "url": "/health", "group_id": 45041 },
                  { "title": "Energy", "url": "/energy", "group_id": 45043 },
                  {
                    "title": "Environment",
                    "url": "/environment",
                    "group_id": 45045,
                  },
                ],
                "group_id": 16061,
              }, {
                "title": "Creators",
                "url": "/creators",
                "pinned": false,
                "all_link": { "title": "All Creators", "url": "/creators" },
                "sub_items": [{
                  "title": "YouTube",
                  "url": "/youtube",
                  "supplemental": false,
                  "group_id": 54407,
                }, {
                  "title": "Instagram",
                  "url": "/instagram",
                  "supplemental": false,
                  "group_id": 62257,
                }, {
                  "title": "Adobe",
                  "url": "/adobe",
                  "supplemental": false,
                  "group_id": 79777,
                }, {
                  "title": "Kickstarter",
                  "url": "/kickstarter",
                  "supplemental": false,
                  "group_id": 54189,
                }, {
                  "title": "Tumblr",
                  "url": "/tumblr",
                  "supplemental": false,
                  "group_id": 45513,
                }, {
                  "title": "Art Club",
                  "url": "art-club",
                  "supplemental": false,
                  "group_id": 79639,
                }, {
                  "title": "Cameras",
                  "url": "/camera-review",
                  "supplemental": false,
                  "group_id": 63415,
                }, {
                  "title": "Photography",
                  "url": "/photography",
                  "supplemental": false,
                  "group_id": 61,
                }, {
                  "title": "What’s in your bag?",
                  "url": "/whats-in-your-bag",
                  "supplemental": false,
                  "group_id": 508,
                }],
                "group_id": 79759,
              }, {
                "title": "Entertainment",
                "url": "/entertainment",
                "pinned": true,
                "all_link": {
                  "title": "All Entertainment",
                  "url": "/entertainment",
                },
                "sub_items": [
                  { "title": "Film", "url": "/film", "group_id": 32340 },
                  { "title": "TV", "url": "/tv", "group_id": 32338 },
                  { "title": "Games", "url": "/games", "group_id": 57 },
                  {
                    "title": "Fortnite",
                    "url": "/fortnite",
                    "supplemental": false,
                    "group_id": 72317,
                  },
                  {
                    "title": "Game of Thrones",
                    "url": "/game-of-thrones",
                    "supplemental": false,
                    "group_id": 50679,
                  },
                  {
                    "title": "Books",
                    "url": "/books",
                    "supplemental": false,
                    "group_id": 62769,
                  },
                  { "title": "Comics", "url": "/comics", "group_id": 41804 },
                  { "title": "Music", "url": "/music", "group_id": 30982 },
                ],
                "group_id": 20485,
              }, {
                "title": "Video",
                "url": "https://goo.gl/G5RXGs",
                "pinned": false,
                "sub_items": [],
              }, {
                "title": "Features",
                "url": "/features",
                "pinned": false,
                "sub_items": [],
                "group_id": 468,
              }, {
                "title": "Podcasts",
                "url": "/podcasts",
                "pinned": false,
                "sub_items": [],
              }, {
                "title": "Newsletters",
                "url": "/pages/newsletters",
                "pinned": false,
                "all_link": { "title": "", "url": "" },
                "sub_items": [],
              }, {
                "title": "Merch Store",
                "url": "https://store.dftba.com/collections/the-verge",
                "pinned": false,
                "all_link": { "title": "", "url": "" },
                "sub_items": [],
              }],
            },
          },
          "entryGroup": {
            "recentEntries": {
              "results": [{
                "uuid": "f0747465-c7c0-4647-96d9-64ca293e318c",
                "title":
                  "Today on the Vergecast: Twitter chaos, Meta chaos, crypto chaos, and did we mention all the chaos? Oh, and also, some chaos.",
                "uid": "Entry:f0747465-c7c0-4647-96d9-64ca293e318c",
                "url":
                  "https://www.theverge.com/2022/11/11/23453077/today-on-the-vergecast-twitter-chaos-meta-chaos-crypto-chaos-and-did-we-mention-all-the-chaos-oh-and",
                "publishDate": "2022-11-11T13:32:27.926Z",
                "author": { "fullName": "David Pierce" },
                "authorProfile": {
                  "url": "https://www.theverge.com/authors/david-pierce",
                },
              }, {
                "uuid": "74b510e0-ba51-4b05-86a1-dd5c9dad4628",
                "title":
                  "Today on The Vergecast: Bias busters, free speech, and CHIPS!",
                "uid": "Entry:74b510e0-ba51-4b05-86a1-dd5c9dad4628",
                "url":
                  "https://www.theverge.com/2022/11/9/23449232/today-on-the-vergecast-bias-busters-free-speech-and-chips",
                "publishDate": "2022-11-09T15:27:54.931Z",
                "author": { "fullName": "David Pierce" },
                "authorProfile": {
                  "url": "https://www.theverge.com/authors/david-pierce",
                },
              }, {
                "uuid": "e626e91c-28a0-42ce-acb5-626f6f39b1f4",
                "title":
                  "Why Figma is selling to Adobe for $20 billion, with CEO Dylan Field",
                "uid": "Entry:e626e91c-28a0-42ce-acb5-626f6f39b1f4",
                "url":
                  "https://www.theverge.com/2022/11/8/23445821/figma-adobe-acquisition-design-vr-ai-meta",
                "publishDate": "2022-11-08T17:45:17.279Z",
                "author": { "fullName": "Nilay Patel" },
                "authorProfile": {
                  "url": "https://www.theverge.com/authors/nilay-patel",
                },
              }, {
                "uuid": "2670bac6-8034-4105-b515-bc8e725e2549",
                "title":
                  "Today on The Vergecast: the great “will you pay for Twitter?” debate.",
                "uid": "Entry:2670bac6-8034-4105-b515-bc8e725e2549",
                "url":
                  "https://www.theverge.com/2022/11/4/23440444/today-on-the-vergecast-the-great-will-you-pay-for-twitter-debate",
                "publishDate": "2022-11-04T14:13:39.671Z",
                "author": { "fullName": "David Pierce" },
                "authorProfile": {
                  "url": "https://www.theverge.com/authors/david-pierce",
                },
              }, {
                "uuid": "10a719ba-df51-412c-99db-42b39f289520",
                "title": "The mystery of Biden’s deadlocked FCC",
                "uid": "Entry:10a719ba-df51-412c-99db-42b39f289520",
                "url":
                  "https://www.theverge.com/23437518/biden-fcc-gigi-sohn-fox-news-comcast-senate-democrats-midterms-election",
                "publishDate": "2022-11-03T17:40:04.084Z",
                "author": { "fullName": "Nilay Patel" },
                "authorProfile": {
                  "url": "https://www.theverge.com/authors/nilay-patel",
                },
              }],
            },
          },
          "hubPages": [{
            "title": "Must Reads",
            "slug": "must-read-stories",
            "placeables": [{
              "__typename": "Entry",
              "uid": "Entry:90183e58-f692-4654-8430-3162edc1aecf",
              "title":
                "Amazon mass layoffs will reportedly ax 10,000 people this week",
              "url":
                "https://www.theverge.com/2022/11/14/23458097/amazon-layoffs-expected-10000-employees",
              "author": { "fullName": "Chris Welch" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/chris-welch",
              },
              "publishDate": "2022-11-14T17:20:20.700Z",
              "originalPublishDate": "2022-11-14T17:20:20.700Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/-DH_98tyCltbrWTMSUoI7BLSJ1g=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23935561/acastro_STK103__04.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:f2750bb4-5219-4bd8-a1ea-e2c92203ab93",
              "title": "NASA’s Space Launch System rocket weathers the storm",
              "url":
                "https://www.theverge.com/2022/11/14/23458735/nasa-space-launch-system-nicole-rocket-artemis-1",
              "author": { "fullName": "Georgina Torbet" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/georgina-torbet",
              },
              "publishDate": "2022-11-14T21:32:43.111Z",
              "originalPublishDate": "2022-11-14T21:32:43.111Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/ZxTe2U-TXr4bY66a8jvpXxVQMNI=/0x0:3000x2000/3000x2000/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:ee54cd44-25aa-4d56-8432-5f2a6b728b5d",
              "title":
                "Elon Musk says he fired engineer who corrected him on Twitter",
              "url":
                "https://www.theverge.com/2022/11/14/23458247/elon-musk-fires-engineer-correcting-twitter",
              "author": { "fullName": "Mitchell Clark" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/mitchell-clark",
              },
              "publishDate": "2022-11-15T00:51:02.576Z",
              "originalPublishDate": "2022-11-14T20:43:30.040Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/IAzrDTfLkQP2m76_BTpPl-PalMc=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:9d0dd30d-76d6-4303-b1d2-ad7add702b2f",
              "title":
                "The Witcher 3’s next-gen patch will arrive on December 14th",
              "url":
                "https://www.theverge.com/2022/11/14/23457988/witcher-3-ps5-xbox-series-x-s-upgrade-ray-tracing-release-date",
              "author": { "fullName": "Cameron Faulkner" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/cameron-faulkner",
              },
              "publishDate": "2022-11-14T16:16:22.558Z",
              "originalPublishDate": "2022-11-14T16:16:22.558Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/473MUKd-VuhB1qseIk2ZrzAYC98=/0x0:2048x1152/2048x1152/filters:focal(1024x576:1025x577)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195383/W3NG_ReleaseDate_16x9.jpeg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:d9ad3266-02e2-4d94-877e-045d04cb1b2b",
              "title":
                "Here’s why Elizabeth Holmes thinks she shouldn’t go to prison",
              "url":
                "https://www.theverge.com/2022/11/14/23455228/elizabeth-holmes-why-shouldnt-go-prison-theranos-court",
              "author": { "fullName": "Emma Roth" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/emma-roth",
              },
              "publishDate": "2022-11-14T15:13:06.333Z",
              "originalPublishDate": "2022-11-14T15:13:06.333Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/6CFGlcABoAqWGLyXDpxcHmwD7o8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951558/VRG_Illo_STK177_L_Normand_ElizabethHolmes_Neutral.jpg",
              },
            }],
          }, {
            "title": "Tech",
            "slug": "tech",
            "placeables": [{
              "__typename": "Entry",
              "uid": "Entry:a368ff55-9bfa-42b9-8520-9d875c38a0e6",
              "title":
                "Google is bringing Material You-style color themes to desktop Chrome",
              "url":
                "https://www.theverge.com/2022/11/14/23457599/google-chrome-desktop-material-you-color-theming-feature",
              "author": { "fullName": "Jon Porter" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/jon-porter",
              },
              "publishDate": "2022-11-14T12:10:59.882Z",
              "originalPublishDate": "2022-11-14T12:10:59.882Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/Cd8NREkn0klgQy1cMU3Jg4bHAhU=/0x0:1422x1080/1422x1080/filters:focal(302x208:303x209)/cdn.vox-cdn.com/uploads/chorus_asset/file/24194828/Screen_Shot_2022_11_14_at_11.43.33_AM.png",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:784fca9e-60d7-4601-81f4-cdc3aa89e314",
              "title":
                "Buying ads on Twitter is ‘high-risk’ according to the world’s biggest ad agency",
              "url":
                "https://www.theverge.com/2022/11/14/23459254/twitter-high-risk-ads-groupm-advertisers-content-moderation",
              "author": { "fullName": "Mitchell Clark" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/mitchell-clark",
              },
              "publishDate": "2022-11-15T02:12:37.418Z",
              "originalPublishDate": "2022-11-15T02:12:37.418Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/voukr_9z6AE5jboFhebWNP1q54g=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951431/acastro_STK050_05.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:d019bcc6-bcdb-496f-a164-ce9bc3372d4f",
              "title":
                "Elon Musk ignored Twitter’s internal warnings about his paid verification scheme",
              "url":
                "https://www.theverge.com/2022/11/14/23459244/twitter-elon-musk-blue-verification-internal-warnings-ignored",
              "author": { "fullName": "Casey Newton" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/casey-newton",
              },
              "publishDate": "2022-11-15T01:35:02.256Z",
              "originalPublishDate": "2022-11-15T01:35:02.256Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/weiPJ7jcby2hGcO_cWTHFPhzQUI=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24090214/STK171_VRG_Illo_4_Normand_ElonMusk_04.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:ee54cd44-25aa-4d56-8432-5f2a6b728b5d",
              "title":
                "Elon Musk says he fired engineer who corrected him on Twitter",
              "url":
                "https://www.theverge.com/2022/11/14/23458247/elon-musk-fires-engineer-correcting-twitter",
              "author": { "fullName": "Mitchell Clark" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/mitchell-clark",
              },
              "publishDate": "2022-11-15T00:51:02.576Z",
              "originalPublishDate": "2022-11-14T20:43:30.040Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/IAzrDTfLkQP2m76_BTpPl-PalMc=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23382327/VRG_Illo_STK022_K_Radtke_Musk_Twitter_Upside_Down.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:3dd02080-6279-4fd7-bbb0-7df6d1ab9d8a",
              "title": "Nike is still trying to make NFTs happen with .Swoosh",
              "url":
                "https://www.theverge.com/2022/11/14/23458863/nike-nfts-happen-dot-swoosh-sneakers-crypto",
              "author": { "fullName": "Emma Roth" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/emma-roth",
              },
              "publishDate": "2022-11-14T23:51:18.741Z",
              "originalPublishDate": "2022-11-14T23:51:18.741Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/HmTOORPJVN94K8id5ZdXpCcImOA=/0x0:2768x1600/2768x1600/filters:focal(1391x1119:1392x1120)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196673/swooshdesktop1.jpg",
              },
            }],
          }, {
            "title": "Reviews",
            "slug": "reviews",
            "placeables": [{
              "__typename": "Entry",
              "uid": "Entry:211e51fb-80de-4839-9c99-b8909adb4bd9",
              "title": "Meta Quest Pro review: get me out of here",
              "url":
                "https://www.theverge.com/23451629/meta-quest-pro-vr-headset-horizon-review",
              "author": { "fullName": "Adi Robertson" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/adi-robertson",
              },
              "publishDate": "2022-11-11T15:30:00.000Z",
              "originalPublishDate": "2022-11-11T15:30:00.000Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/K4wIiJdHT8l3UkpQKszqAbgZNA4=/0x0:2040x1360/2040x1360/filters:focal(1339x187:1340x188)/cdn.vox-cdn.com/uploads/chorus_asset/file/24159374/226369_Meta_Quest_Pro_AKrales_0102.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:88f13d3b-87ee-4a06-b906-8e24cc47a2a6",
              "title": "LG C2 OLED TV review: you can’t go wrong",
              "url": "https://www.theverge.com/23453621/lg-c2-oled-tv-review",
              "author": { "fullName": "Chris Welch" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/chris-welch",
              },
              "publishDate": "2022-11-13T14:00:00.000Z",
              "originalPublishDate": "2022-11-13T14:00:00.000Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/Ai9yliH3bWZLjXY5SdAndTYTVlM=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24191324/209877FC_E1ED_499D_94D8_0CD833D167B6.jpeg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:08c704b9-331a-4018-8921-50c248511679",
              "title": "The best smartwatches for Android users",
              "url":
                "https://www.theverge.com/23449363/best-android-smartwatches-2022-wear-os",
              "author": { "fullName": "Victoria Song" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/victoria-song",
              },
              "publishDate": "2022-11-10T18:15:20.295Z",
              "originalPublishDate": "2022-11-10T18:15:20.295Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/dMqadYGRbNrKwYxeTyYfC9O4HP4=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24182143/226402_Android_Smartwatch_Buyers_Guide_WJoel.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:a8f0f5fb-1186-464d-beb4-5a79b388efdd",
              "title":
                "Microsoft Surface Pro 9 (Intel) review: this is the one to buy",
              "url":
                "https://www.theverge.com/23450010/microsoft-surface-pro-9-intel-12th-gen-test-review-benchmark",
              "author": { "fullName": "Monica Chin" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/monica-chin",
              },
              "publishDate": "2022-11-10T14:00:00.000Z",
              "originalPublishDate": "2022-11-10T14:00:00.000Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/BvHORhUjQPEY0PZK0KTrGK26GxU=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24171034/226393_Microsoft_surface_Pro_9_Intel_AKrales_0225.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:6ada8c97-17e7-4942-aef9-4e82eb3b52ef",
              "title":
                "iPhone 14 Pro vs. S22 Ultra vs. Pixel 7 Pro: what 1,000 photos tell us",
              "url":
                "https://www.theverge.com/2022/11/9/23447192/iphone-14-pro-s22-ultra-pixel-7-pro-best-smartphone-camera",
              "author": { "fullName": "Becca Farsace" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/becca-farsace",
              },
              "publishDate": "2022-11-09T15:00:00.000Z",
              "originalPublishDate": "2022-11-09T15:00:00.000Z",
              "promoImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/q5c0ilHcMN79Y_i_72lezHstRjg=/0x0:1024x683/1024x683/filters:focal(512x342:513x343)/cdn.vox-cdn.com/uploads/chorus_asset/file/24179155/1000_PHOTOS.jpg",
              },
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": null,
            }],
          }, {
            "title": "Science",
            "slug": "science",
            "placeables": [{
              "__typename": "Entry",
              "uid": "Entry:0c7353b7-8746-4647-81f8-a7c8b321c896",
              "title":
                "NASA’s Artemis I launch is delayed again as Tropical Storm Nicole approaches",
              "url":
                "https://www.theverge.com/2022/11/9/23449578/nasa-artemis-i-launch-delay-tropical-storm-nicole",
              "author": { "fullName": "Mary Beth Griggs" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/mary-beth-griggs",
              },
              "publishDate": "2022-11-09T20:42:08.358Z",
              "originalPublishDate": "2022-11-09T20:42:08.358Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/eJcWmq4_FoMTfn9la3rgd4u3vAg=/0x0:4828x2482/4828x2482/filters:focal(2974x1370:2975x1371)/cdn.vox-cdn.com/uploads/chorus_asset/file/24182052/1244568447.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:520a9fb3-0b97-4636-9699-a48b57220ef2",
              "title":
                "California updates proposal on solar incentives that reduces costs but pays less",
              "url":
                "https://www.theverge.com/2022/11/14/23457902/california-clean-energy-solar-incentives-net-metering-proposal-changes",
              "author": { "fullName": "Umar Shakir" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/umar-shakir",
              },
              "publishDate": "2022-11-14T22:31:19.644Z",
              "originalPublishDate": "2022-11-14T22:31:19.644Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/XPNzVhggekpVXxRHcw2MjaguNOw=/0x0:5982x3987/5982x3987/filters:focal(2991x1994:2992x1995)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195622/1230436694.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:f2750bb4-5219-4bd8-a1ea-e2c92203ab93",
              "title": "NASA’s Space Launch System rocket weathers the storm",
              "url":
                "https://www.theverge.com/2022/11/14/23458735/nasa-space-launch-system-nicole-rocket-artemis-1",
              "author": { "fullName": "Georgina Torbet" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/georgina-torbet",
              },
              "publishDate": "2022-11-14T21:32:43.111Z",
              "originalPublishDate": "2022-11-14T21:32:43.111Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/ZxTe2U-TXr4bY66a8jvpXxVQMNI=/0x0:3000x2000/3000x2000/filters:focal(1625x997:1626x998)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196464/1244757596.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:690d71d2-df8f-4676-8d90-ce75f7b5fa5f",
              "title":
                "Oil giant Occidental wants to remake itself as a climate tech leader in Texas",
              "url":
                "https://www.theverge.com/2022/11/14/23451865/occidental-oil-direct-air-capture-carbon-texas",
              "author": { "fullName": "Justine Calma" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/justine-calma",
              },
              "publishDate": "2022-11-14T19:18:27.502Z",
              "originalPublishDate": "2022-11-14T19:18:27.502Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/4evFydFrNZLTlUzx2R9QJyM936U=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24195442/1385188367.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:d9ad3266-02e2-4d94-877e-045d04cb1b2b",
              "title":
                "Here’s why Elizabeth Holmes thinks she shouldn’t go to prison",
              "url":
                "https://www.theverge.com/2022/11/14/23455228/elizabeth-holmes-why-shouldnt-go-prison-theranos-court",
              "author": { "fullName": "Emma Roth" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/emma-roth",
              },
              "publishDate": "2022-11-14T15:13:06.333Z",
              "originalPublishDate": "2022-11-14T15:13:06.333Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/6CFGlcABoAqWGLyXDpxcHmwD7o8=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951558/VRG_Illo_STK177_L_Normand_ElizabethHolmes_Neutral.jpg",
              },
            }],
          }, {
            "title": "Creators",
            "slug": "creators",
            "placeables": [{
              "__typename": "Entry",
              "uid": "Entry:cc057a9b-168d-4022-af11-c46cd9f0282f",
              "title":
                "TikTok is testing its long-awaited in-app shopping feature",
              "url":
                "https://www.theverge.com/2022/11/11/23453510/tiktok-shop-ecommerce-feature-us-test",
              "author": { "fullName": "Mia Sato" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/mia-sato",
              },
              "publishDate": "2022-11-11T21:28:17.507Z",
              "originalPublishDate": "2022-11-11T21:28:17.507Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/e3MVdDnQ6JuZTxca4j-R8RMQ6Nw=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951407/STK051_VRG_Illo_N_Barclay_5_tiktok.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:f3fd8fa3-e720-42a7-893d-e026bc6bd6cc",
              "title": "YouTube makes it easy to set up an AMA",
              "url":
                "https://www.theverge.com/2022/11/10/23452321/youtube-live-qa-ama-livestreams-question-answer",
              "author": { "fullName": "Jay Peters" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/jay-peters",
              },
              "publishDate": "2022-11-11T00:18:08.697Z",
              "originalPublishDate": "2022-11-11T00:18:08.697Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/dgIoMFxvb-OqURuy3-rzOEoqkGk=/0x0:2040x1360/2040x1360/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/23986640/acastro_STK092_04.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:8ebafa2b-9809-4673-93f1-6e84718ae14f",
              "title":
                "Design platform Canva launches text-to-image AI feature",
              "url":
                "https://www.theverge.com/2022/11/10/23450965/canva-text-to-image-ai-tool-free-users",
              "author": { "fullName": "James Vincent" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/james-vincent",
              },
              "publishDate": "2022-11-10T14:00:00.000Z",
              "originalPublishDate": "2022-11-10T14:00:00.000Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/2ZAvHRNV77pv2KRjfoApuuq8bHw=/0x0:2048x1394/2048x1394/filters:focal(1024x697:1025x698)/cdn.vox-cdn.com/uploads/chorus_asset/file/24184269/pasted_image_0.png",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:f3c50339-bcbc-48a1-bf35-6c8c56b72f72",
              "title": "Hot Pod Summit LA: from Crooked to Coco",
              "url":
                "https://www.theverge.com/2022/11/9/23449989/hot-pod-summit-coco-conan-crooked-pod-save-spotify",
              "author": { "fullName": "Ariel Shapiro" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/ariel-shapiro",
              },
              "publishDate": "2022-11-09T21:00:00.000Z",
              "originalPublishDate": "2022-11-09T21:00:00.000Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/ySXRFsqDfZd4wLLLXxWdEZctz0Q=/0x0:2051x1367/2051x1367/filters:focal(1017x676:1018x677)/cdn.vox-cdn.com/uploads/chorus_asset/file/23434856/Hot_Pod_Site_Post.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:c9ff28e6-6dee-416d-8ac1-2476bd701bb0",
              "title":
                "Twitter’s new double-check verification disappears, Elon Musk says he ‘killed it’",
              "url":
                "https://www.theverge.com/2022/11/9/23449422/elon-musk-twitter-blue-official-verified-gray-checks-disappear",
              "author": { "fullName": "Mia Sato" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/mia-sato",
              },
              "publishDate": "2022-11-09T17:36:27.753Z",
              "originalPublishDate": "2022-11-09T17:36:27.753Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/jjbVkuU30xlFoxipHtM48J4EGPk=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23951434/acastro_STK050_08.jpg",
              },
            }],
          }, {
            "title": "Entertainment",
            "slug": "entertainment",
            "placeables": [{
              "__typename": "Entry",
              "uid": "Entry:a502ec33-269e-48ef-9222-3dddf5b66e27",
              "title":
                "Wakanda Forever’s mid-credits scene is exactly the right kind of surprising",
              "url":
                "https://www.theverge.com/23447906/black-panther-wakanda-forever-mid-credits",
              "author": { "fullName": "Charles Pulliam-Moore" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/charles-pulliam-moore",
              },
              "publishDate": "2022-11-12T14:00:00.000Z",
              "originalPublishDate": "2022-11-12T14:00:00.000Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/HyUFTa51CH3GQWRetS622nWSSZY=/0x0:2548x1194/2548x1194/filters:focal(1274x597:1275x598)/cdn.vox-cdn.com/uploads/chorus_asset/file/24179421/Screen_Shot_2022_11_08_at_3.49.32_PM.png",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:5b700a2b-782f-4e65-a969-3caf84c3a76b",
              "title":
                "At the Overwatch League grand finals, a candy bar was the real winner",
              "url":
                "https://www.theverge.com/2022/11/11/23453321/overwatch-league-grand-finals-2022-dallas-fuel",
              "author": { "fullName": "Ash Parrish" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/ash-parrish",
              },
              "publishDate": "2022-11-11T20:53:05.239Z",
              "originalPublishDate": "2022-11-11T20:53:05.239Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/FWim8deu4ZcSy3gSZMkRB4h9ApM=/0x0:3000x2000/3000x2000/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24188747/OWL22_2022_11_04_FINALS_DAL_VICTORYMOMENT_5089.jpg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:fe3c8e4c-e627-4fb7-aacb-2a7e5f4fc97e",
              "title":
                "Moon Girl and Devil Dinosaur’s theme song has no business being this good",
              "url":
                "https://www.theverge.com/2022/11/14/23273274/marvel-moon-girl-magic-devil-dinosaur",
              "author": { "fullName": "Charles Pulliam-Moore" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/charles-pulliam-moore",
              },
              "publishDate": "2022-11-14T21:01:24.485Z",
              "originalPublishDate": "2022-11-14T21:01:24.485Z",
              "promoImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/fbosD1FyGM5yzpWaCuAYLF3URXo=/0x0:2880x1611/2880x1611/filters:focal(1440x806:1441x807)/cdn.vox-cdn.com/uploads/chorus_asset/file/24196076/Screen_Shot_2022_11_14_at_1.01.04_PM.png",
              },
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": null,
            }, {
              "__typename": "Entry",
              "uid": "Entry:e32f2838-8fd9-48c4-8b80-f685aa8b86ed",
              "title":
                "Andor’s first two episodes will air on TV over Thanksgiving",
              "url":
                "https://www.theverge.com/2022/11/14/23458078/disney-star-wars-andor-first-two-episodes-broadcast-tv-abc-fx-freeform-hulu",
              "author": { "fullName": "Jay Peters" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/jay-peters",
              },
              "publishDate": "2022-11-14T17:04:01.236Z",
              "originalPublishDate": "2022-11-14T17:04:01.236Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/l6Q-rzRZiw5dEWyaetEph5jlU2A=/0x0:3840x1595/3840x1595/filters:focal(2146x770:2147x771)/cdn.vox-cdn.com/uploads/chorus_asset/file/24029649/PGM_FF_002390.jpeg",
              },
            }, {
              "__typename": "Entry",
              "uid": "Entry:9bdbbfef-116e-42ad-8ed8-b98c37393f9a",
              "title": "The best entertainment of 2022",
              "url":
                "https://www.theverge.com/22949266/best-games-movies-tv-2022",
              "author": { "fullName": "Andrew Webster" },
              "authorProfile": {
                "url": "https://www.theverge.com/authors/andrew-webster",
              },
              "publishDate": "2022-11-08T17:10:46.221Z",
              "originalPublishDate": "2022-03-02T14:00:00.000Z",
              "promoImage": null,
              "community": {
                "placeholderImageUrl":
                  "https://cdn.vox-cdn.com/uploads/network/placeholder_image/2/The_Verge.644.jpg",
              },
              "leadImage": {
                "url":
                  "https://cdn.vox-cdn.com/thumbor/U_oaCLUULoJ7xbA0EQHUbRc028w=/0x0:6000x4000/6000x4000/filters:focal(3000x2000:3001x2001)/cdn.vox-cdn.com/uploads/chorus_asset/file/24178703/SUM_10220_R.jpg",
              },
            }],
          }],
        },
      },
      "fetchedAt": 1668478803729,
    };
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get(key);
    assertEquals(res, value);
  });
});

Deno.test("bad data", async (t) => {
  await t.step("empty string", async () => {
    const key = newKey();
    const value = "";
    const redis = new Redis(client);
    await redis.set(key, encodeURIComponent(value));
    const res = await redis.get<string>(key);

    assertEquals(res!, value);
  });

  await t.step("not found key", async () => {
    const redis = new Redis(client);
    const res = await redis.get<string>(newKey());

    assertEquals(res!, null);
  });

  await t.step("with encodeURIComponent", async () => {
    const key = newKey();
    const value = "😀";
    const redis = new Redis(client);
    await redis.set(key, encodeURIComponent(value));
    const res = await redis.get<string>(key);

    assertEquals(res!, decodeURIComponent(value));
  });
  await t.step("emojis", async () => {
    const key = newKey();
    const value = "😀";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get(key);

    assertEquals(res, value);
  });
});

Deno.test("disable base64 encoding", async (t) => {
  await t.step("emojis", async () => {
    const key = newKey();
    const value = "😀";
    const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
    if (!url) {
      throw new Error("Could not find url");
    }
    const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
    if (!token) {
      throw new Error("Could not find token");
    }

    const client = new HttpClient({
      baseUrl: url,
      headers: { authorization: `Bearer ${token}` },
      responseEncoding: false,
    });
    const redis = new Redis(client);
    redis.use(async (r, next) => {
      const res = await next(r);
      console.log({ res });
      return res;
    });
    await redis.set(key, value);
    const res = await redis.get(key);
    console.log({ value, res });

    assertEquals(res, value);
  });

  await t.step("random bytes", async () => {
    const key = newKey();
    const value = crypto.getRandomValues(new Uint8Array(2 ** 16)).toString();
    const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
    if (!url) {
      throw new Error("Could not find url");
    }
    const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
    if (!token) {
      throw new Error("Could not find token");
    }

    const client = new HttpClient({
      baseUrl: url,
      headers: { authorization: `Bearer ${token}` },
      responseEncoding: false,
    });
    const redis = new Redis(client);
    redis.use(async (r, next) => {
      const res = await next(r);
      console.log({ res });
      return res;
    });
    await redis.set(key, value);
    const res = await redis.get(key);
    console.log({ value, res });

    assertEquals(res, value);
  });
});
