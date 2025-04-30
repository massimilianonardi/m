
// https://www.vinted.it/api/v2/users/25943425/items?page=1&per_page=21&cond=active&selected_item_id=5105638873
// https://www.vinted.it/api/v2/users/155761817/items?page=1&per_page=21&cond=active&selected_item_id=4170366942
// https://www.vinted.it/api/v2/users/155761817/items/favourites?page=0&include_sold=true&per_page=90
// https://www.vinted.it/api/v2/items/4650574236
// venduto: "item_closing_action": "sold" + "can_be_sold": false + "instant_buy": false + "can_buy": false + "accepted_pay_in_methods": []
// search: https://www.vinted.it/api/v2/catalog/items?page=1&per_page=96&time=1732028313&search_text=hot+wheels&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=

/*
function downloadFile(url, fileName) {
  fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
    .then(res => res.blob())
    .then(res => {
      const aElement = document.createElement('a');
      aElement.setAttribute('download', fileName);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      aElement.setAttribute('target', '_blank');
      aElement.click();
      URL.revokeObjectURL(href);
    });
};

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=0&include_sold=true&per_page=90", "fav_0");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=1&include_sold=true&per_page=90", "fav_1");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=2&include_sold=true&per_page=90", "fav_2");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=3&include_sold=true&per_page=90", "fav_3");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=4&include_sold=true&per_page=90", "fav_4");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=5&include_sold=true&per_page=90", "fav_5");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=6&include_sold=true&per_page=90", "fav_6");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=7&include_sold=true&per_page=90", "fav_7");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=8&include_sold=true&per_page=90", "fav_8");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=9&include_sold=true&per_page=90", "fav_9");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=10&include_sold=true&per_page=90", "fav_10");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=11&include_sold=true&per_page=90", "fav_11");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=12&include_sold=true&per_page=90", "fav_12");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=13&include_sold=true&per_page=90", "fav_13");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=14&include_sold=true&per_page=90", "fav_14");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=15&include_sold=true&per_page=90", "fav_15");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=16&include_sold=true&per_page=90", "fav_16");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=17&include_sold=true&per_page=90", "fav_17");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=18&include_sold=true&per_page=90", "fav_18");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=19&include_sold=true&per_page=90", "fav_19");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=20&include_sold=true&per_page=90", "fav_20");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=21&include_sold=true&per_page=90", "fav_21");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=22&include_sold=true&per_page=90", "fav_22");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=23&include_sold=true&per_page=90", "fav_23");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=24&include_sold=true&per_page=90", "fav_24");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=25&include_sold=true&per_page=90", "fav_25");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=26&include_sold=true&per_page=90", "fav_26");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=27&include_sold=true&per_page=90", "fav_27");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=28&include_sold=true&per_page=90", "fav_28");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=29&include_sold=true&per_page=90", "fav_29");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=30&include_sold=true&per_page=90", "fav_30");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=31&include_sold=true&per_page=90", "fav_31");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=32&include_sold=true&per_page=90", "fav_32");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=33&include_sold=true&per_page=90", "fav_33");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=34&include_sold=true&per_page=90", "fav_34");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=35&include_sold=true&per_page=90", "fav_35");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=36&include_sold=true&per_page=90", "fav_36");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=37&include_sold=true&per_page=90", "fav_37");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=38&include_sold=true&per_page=90", "fav_38");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=39&include_sold=true&per_page=90", "fav_39");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=40&include_sold=true&per_page=90", "fav_40");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=41&include_sold=true&per_page=90", "fav_41");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=42&include_sold=true&per_page=90", "fav_42");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=43&include_sold=true&per_page=90", "fav_43");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=44&include_sold=true&per_page=90", "fav_44");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=45&include_sold=true&per_page=90", "fav_45");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=46&include_sold=true&per_page=90", "fav_46");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=47&include_sold=true&per_page=90", "fav_47");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=48&include_sold=true&per_page=90", "fav_48");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=49&include_sold=true&per_page=90", "fav_49");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=50&include_sold=true&per_page=90", "fav_50");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=51&include_sold=true&per_page=90", "fav_51");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=52&include_sold=true&per_page=90", "fav_52");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=53&include_sold=true&per_page=90", "fav_53");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=54&include_sold=true&per_page=90", "fav_54");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=55&include_sold=true&per_page=90", "fav_55");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=56&include_sold=true&per_page=90", "fav_56");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=57&include_sold=true&per_page=90", "fav_57");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=58&include_sold=true&per_page=90", "fav_58");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=59&include_sold=true&per_page=90", "fav_59");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=60&include_sold=true&per_page=90", "fav_60");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=61&include_sold=true&per_page=90", "fav_61");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=62&include_sold=true&per_page=90", "fav_62");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=63&include_sold=true&per_page=90", "fav_63");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=64&include_sold=true&per_page=90", "fav_64");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=65&include_sold=true&per_page=90", "fav_65");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=66&include_sold=true&per_page=90", "fav_66");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=67&include_sold=true&per_page=90", "fav_67");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=68&include_sold=true&per_page=90", "fav_68");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=69&include_sold=true&per_page=90", "fav_69");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=70&include_sold=true&per_page=90", "fav_70");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=71&include_sold=true&per_page=90", "fav_71");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=72&include_sold=true&per_page=90", "fav_72");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=73&include_sold=true&per_page=90", "fav_73");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=74&include_sold=true&per_page=90", "fav_74");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=75&include_sold=true&per_page=90", "fav_75");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=76&include_sold=true&per_page=90", "fav_76");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=77&include_sold=true&per_page=90", "fav_77");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=78&include_sold=true&per_page=90", "fav_78");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=79&include_sold=true&per_page=90", "fav_79");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=80&include_sold=true&per_page=90", "fav_80");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=81&include_sold=true&per_page=90", "fav_81");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=82&include_sold=true&per_page=90", "fav_82");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=83&include_sold=true&per_page=90", "fav_83");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=84&include_sold=true&per_page=90", "fav_84");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=85&include_sold=true&per_page=90", "fav_85");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=86&include_sold=true&per_page=90", "fav_86");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=87&include_sold=true&per_page=90", "fav_87");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=88&include_sold=true&per_page=90", "fav_88");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=89&include_sold=true&per_page=90", "fav_89");

downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=90&include_sold=true&per_page=90", "fav_90");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=91&include_sold=true&per_page=90", "fav_91");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=92&include_sold=true&per_page=90", "fav_92");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=93&include_sold=true&per_page=90", "fav_93");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=94&include_sold=true&per_page=90", "fav_94");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=95&include_sold=true&per_page=90", "fav_95");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=96&include_sold=true&per_page=90", "fav_96");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=97&include_sold=true&per_page=90", "fav_97");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=98&include_sold=true&per_page=90", "fav_98");
downloadFile("https://www.vinted.it/api/v2/users/155761817/items/favourites?page=99&include_sold=true&per_page=90", "fav_99");

//------------------------------------------------------------------------------

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=0&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=1&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=2&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=3&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=4&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=5&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=6&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=7&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=8&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=9&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=10&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=11&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=12&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=13&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=14&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=15&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=16&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=17&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=18&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=19&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=20&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=21&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=22&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=23&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=24&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=25&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=26&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=27&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=28&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=29&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=30&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=31&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=32&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=33&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=34&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=35&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=36&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=37&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=38&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=39&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=40&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=41&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=42&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=43&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=44&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=45&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=46&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=47&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=48&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=49&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=50&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=51&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=52&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=53&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=54&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=55&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=56&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=57&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=58&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=59&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=60&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=61&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=62&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=63&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=64&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=65&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=66&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=67&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=68&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=69&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=70&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=71&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=72&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=73&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=74&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=75&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=76&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=77&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=78&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=79&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=80&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=81&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=82&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=83&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=84&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=85&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=86&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=87&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=88&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=89&include_sold=true&per_page=90

https://www.vinted.it/api/v2/users/155761817/items/favourites?page=90&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=91&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=92&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=93&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=94&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=95&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=96&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=97&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=98&include_sold=true&per_page=90
https://www.vinted.it/api/v2/users/155761817/items/favourites?page=99&include_sold=true&per_page=90
*/
//------------------------------------------------------------------------------

const appPath = app.getAppPath();

const dataPath = "/m/_vinted";
const itemIndexPath = path.join(dataPath, "item", "index");
const favDumpPath = path.join(dataPath, "dump", "fav");

var photoQueue = [];

//------------------------------------------------------------------------------

// mkdir(dataPath);
// mkdir(itemIndexPath);
// mkdir(favDumpPath);

//------------------------------------------------------------------------------

function parseFavDump()
{
  fs.readdirSync(favDumpPath).forEach(fileName =>
  {
    var fn = path.join(favDumpPath, fileName);
    console.log(fn);
    var json = JSON.parse(fs.readFileSync(fn));
    var items = json.items;
    for(var i = 0; i < items.length; i++)
    {
      var item = items[i];
      var id = "" + item.id;
      if(typeof id !== "string" || id === "")
      {
        console.log("id null", id, item);
        // throw new Exception();
      }
      var itemPath = path.join(itemIndexPath, id);
      if(fs.existsSync(itemPath))
      {
        console.log("id exists", id, item.path);
        // console.log("id exists", id, item.path, item);
        // throw new Exception();
      }
      mkdir(itemPath);
      fs.writeFileSync(path.join(itemPath, "item.json"), JSON.stringify(item, null, 2), "utf-8");
      var photosPath = path.join(itemPath, "photos");
      mkdir(photosPath);

      // todo: download hires images (item.photos, photo.url, photo.full_size_url)
      var photos = item.photos;
      for(var j = 0; j < photos.length; j++)
      {
        var photo = photos[j];
        var photoPath = path.join(photosPath, "img_" + j + ".jpg");
        photoQueue.push({url: photo.full_size_url, path: photoPath});
      }
    }
    var sold = json.sold;
    if(sold != null)
    {
      console.log(sold);
    }
  });

  console.log("processing photo download queue. #photos:" + photoQueue.length);
  processPhotoQueue(0);
}

//------------------------------------------------------------------------------

function processPhotoQueue(index)
{
  var photoPath = photoQueue[index].path;
  var url = photoQueue[index].url;
  console.log("photo", index, photoPath, url);

  if(fs.existsSync(photoPath))
  {
    console.log("photo -> skipped, already exists!", index, photoPath, url);
    processNextPhotoQueue(index);
    return;
  }

  var fstream = fs.createWriteStream(photoPath);
  var req = https.get(url,(res) =>
  {
    res.pipe(fstream);
    // res.on("data", (chunk) => {body += chunk;});
    res.on("end", () => {processNextPhotoQueue(index);});
  }).on("error", (error) =>
  {
    console.error(error.message);
  });
}

function processNextPhotoQueue(index)
{
  if(index + 1 < photoQueue.length)
  {
    processPhotoQueue(index + 1);
  }
  else
  {
    console.log("processing photo download completed! #photos:" + photoQueue.length);
    photoQueue = [];
  }
}

//------------------------------------------------------------------------------

function viewFavList()
{
}

//------------------------------------------------------------------------------

var processFavChunk = function(url, i, lastChunk)
{
  var dlpath = dataPath + "/tmp";
  https.get(url,(res) =>
  {
    var body = "";
    res.on("data", (chunk) => {body += chunk;} );
    res.on("end", () =>
    {
      try
      {
        var fn = dlpath + "/fav_" + i;
        console.log(body);
        // todo save to file
        try
        {
          fs.writeFileSync(fn, body, "utf-8");
        }
        catch(e)
        {
          alert("Failed to save file");
        }
        var json = JSON.parse(body);
        // do something with JSON
        console.log(json);
      }
      catch (error)
      {
        console.error(error.message);
      };
    });
  }).on("error", (error) =>
  {
    console.error(error.message);
  });

  // win.webContents.openDevTools();
};

//------------------------------------------------------------------------------

var loadFavList = function()
{
  var lastIndex = 35;
  for(var i = 0; i < lastIndex; i++)
  {
    var url = "https://www.vinted.it/api/v2/users/155761817/items/favourites?page=" + i + "&include_sold=true&per_page=20";
    processFavChunk(url, i, i === lastIndex);
  }
};

//------------------------------------------------------------------------------
