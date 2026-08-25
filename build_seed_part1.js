const fs = require('fs');
const path = require('path');

const buyers_p1 = `client_id,client_type,first_name,last_name,date_of_birth,gender,country,region,acquisition_purpose,satisfaction_score,loan_applied,referral_channel
C0001,Individual,Kareem,Liu,05-11-1968,F,USA,California,Home,4,Yes,Website
C0002,Individual,Trystan,Oconnor,11/26/1962,M,USA,California,Home,1,No,Website
C0003,Individual,Kale,Gay,04-07-1959,M,USA,California,Home,4,Yes,Agency
C0004,Individual,Russell,Gross,11/25/1959,M,USA,California,Home,5,No,Website
C0005,Company,Marleez,Co,2/28/1976,M,USA,California,Investment,5,No,Website
C0006,Individual,Yurem,Wright,03-06-1957,M,USA,California,Home,3,Yes,Website
C0007,Individual,Xavier,Faulkner,5/24/1947,M,Canada,Quebec,Investment,5,No,Website
C0008,Individual,Kayden,Olsen,10/17/1969,F,USA,California,Home,5,No,Website
C0009,Individual,Joaquin,Mullins,10-05-1975,M,USA,California,Investment,5,No,Agency
C0010,Individual,Nicolas,Navarro,6/17/1966,M,USA,Oregon,Investment,3,No,Agency
C0011,Individual,Laci,Guerra,6/17/1956,F,USA,California,Home,2,Yes,Website
C0012,Company,Kylax,Co,4/25/1975,M,USA,California,Investment,5,No,Website
C0013,Individual,Harley,Lucero,08-10-1962,M,USA,California,Home,1,Yes,Website
C0014,Company,Esther,Co,07-10-1980,M,USA,California,Home,3,Yes,Website
C0015,Individual,Jaylynn,Hickman,8/19/1941,F,USA,California,Home,5,No,Client
C0016,Individual,Olivia,Oconnell,09-03-1939,F,USA,California,Investment,5,No,Website
C0017,Individual,Antonio,Porter,01-08-1977,M,USA,Arizona,Home,3,No,Client
C0018,Individual,Luke,Lynn,02-07-1967,M,USA,California,Home,2,Yes,Agency
C0019,Individual,Anahi,Curry,09-09-1957,M,USA,California,Home,5,Yes,Client
C0020,Individual,Camille,Sharp,10/17/1967,F,USA,California,Home,5,No,Website
C0021,Individual,Jesus,Obrien,06-09-1938,M,USA,Oregon,Investment,3,No,Website
C0022,Individual,Araceli,Nelson,9/14/1966,M,Germany,Berlin,Investment,5,No,Agency
C0023,Individual,Cole,Taylor,12-06-1958,M,USA,California,Home,3,Yes,Website
C0024,Individual,Alonso,Terrell,11-05-1963,M,USA,California,Investment,4,No,Website
C0025,Individual,Rodolfo,Gibson,1/20/1937,M,USA,Nevada,Home,2,Yes,Website
C0026,Individual,Joseph,Reeves,9/23/1962,M,USA,California,Investment,5,No,Website
C0027,Individual,Grant,Weber,09-08-1968,M,USA,California,Home,5,Yes,Website
C0028,Individual,Ava,Phelps,4/15/1958,F,USA,California,Home,3,No,Client
C0029,Individual,Kyla,Walker,2/26/1976,F,USA,Colorado,Home,4,Yes,Agency
C0030,Individual,Alanna,Hess,6/19/1952,F,USA,Nevada,Home,3,No,Website
C0031,Individual,Skylar,Buchanan,12/25/1977,M,USA,Nevada,Home,4,Yes,Website
C0032,Individual,Rodrigo,Robinson,08-11-1966,M,USA,California,Home,4,No,Website
C0033,Individual,Lydia,Tate,8/14/1968,F,USA,California,Home,3,Yes,Website
C0034,Individual,Lauryn,Patrick,10/30/1969,F,Belgium,Brussels,Home,2,No,Agency
C0035,Individual,Diego,Mendez,05-12-1965,M,Mexico,Mexico City,Home,3,No,Agency
C0036,Individual,Victor,Jensen,09-01-1973,M,USA,California,Home,4,No,Website
C0037,Individual,Scarlet,Hendricks,1/20/1962,F,USA,California,Home,5,Yes,Website
C0038,Individual,Janelle,Espinoza,12/25/1974,F,USA,California,Investment,4,No,Client
C0039,Individual,Aleksandra,Karenina,6/13/1967,F,Russia,Krasnodar Krai,Home,1,No,Agency
C0040,Individual,Conner,Huff,3/22/1975,M,USA,Nevada,Home,5,No,Website
C0041,Individual,Zain,Horne,4/13/1967,M,USA,Arizona,Home,1,Yes,Website
C0042,Individual,Maia,Chandler,08-12-1975,F,USA,Utah,Home,1,Yes,Website
C0043,Individual,Jordyn,Park,04-04-1965,M,USA,Nevada,Investment,3,Yes,Website
C0044,Individual,Diana,Hunt,2/13/1931,F,USA,Arizona,Home,3,No,Website
C0045,Individual,Kevin,Mata,10-12-1968,M,USA,Colorado,Investment,2,No,Agency
C0046,Individual,Brisa,Mckee,9/24/1964,F,USA,California,Home,5,No,Client
C0047,Individual,Mason,Gilbert,7/31/1970,M,USA,Colorado,Home,2,No,Agency
C0048,Individual,Derick,Li,3/20/1957,M,USA,California,Home,3,Yes,Agency
C0049,Individual,Jace,Riggs,8/20/1971,F,USA,California,Home,1,No,Website
C0050,Individual,Jair,Johns,03-05-1940,M,USA,California,Home,5,No,Website
C0051,Individual,Matilda,Madden,03-03-1941,F,USA,Colorado,Home,3,No,Agency
C0052,Individual,Myla,Ewing,02-03-1967,F,USA,Oregon,Investment,2,No,Client
C0053,Individual,Miguel,Walter,01-07-1954,M,USA,Arizona,Home,4,No,Agency
C0054,Company,Bridger CAL,Co,2/15/1967,M,USA,Nevada,Investment,5,No,Website
C0055,Individual,Mara,Franco,06-07-1973,F,USA,California,Home,5,Yes,Agency
C0056,Individual,Erik,Mora,12-07-1964,M,USA,Oregon,Investment,5,No,Agency
C0057,Individual,Henry,Kennedy,06-08-1933,M,USA,California,Home,4,Yes,Agency
C0058,Company,Kenyon,Co,05-03-1969,F,USA,California,Investment,1,Yes,Website
C0059,Individual,Oswaldo,Palmer,6/16/1960,M,USA,California,Home,2,No,Website
C0060,Individual,Kassidy,Vega,05-07-1972,F,USA,California,Home,5,No,Website
C0061,Individual,Morgan,Glass,05-12-1967,M,USA,Utah,Home,5,No,Agency
C0062,Individual,Tyler,Carr,3/27/1974,M,USA,California,Home,5,Yes,Client
C0063,Individual,Yesenia,Marquez,7/23/1942,F,USA,Arizona,Home,4,No,Website
C0064,Individual,Gordon,Brown,02-10-1974,M,UK,Northern Ireland,Investment,4,No,Agency
C0065,Individual,Rodrigo,Ramirez,3/26/1972,M,USA,California,Home,1,No,Agency
C0066,Individual,Melanie,Holland,12/25/1974,F,USA,California,Investment,3,No,Client
C0067,Individual,Enrique,Cardenas,06-10-1977,M,USA,California,Home,2,No,Website
C0068,Individual,Helen,Williamson,2/26/1966,F,USA,Colorado,Home,5,Yes,Agency
C0069,Individual,Isis,Rios,04-01-1970,M,USA,California,Investment,4,No,Website
C0070,Individual,Kayley,Nielsen,4/27/1947,F,USA,Arizona,Home,4,Yes,Website
C0071,Individual,Donavan,Flowers,12/27/1985,M,USA,California,Home,1,Yes,Client
C0072,Individual,Augustus,Hinton,02-03-1953,M,USA,Nevada,Investment,2,No,Website
C0073,Individual,Alejandra,Greer,01-11-1965,F,Denmark,Capital Region,Investment,1,No,Agency
C0074,Individual,Violet,Nixon,01-01-1959,F,USA,Oregon,Investment,5,No,Client
C0075,Individual,Jaelyn,Berger,05-05-1970,F,USA,California,Home,3,No,Website
C0076,Individual,Tristian,Fuller,3/13/1956,M,USA,California,Home,5,No,Agency
C0077,Individual,Christian,Costa,9/14/1980,M,USA,California,Home,5,No,Website
C0078,Individual,Nora,Lynch,4/23/1948,F,USA,California,Home,5,No,Website
C0079,Individual,Dangelo,Shea,2/27/1954,M,Belgium,Brussels,Investment,4,No,Website
C0080,Individual,Aiyana,Christensen,1/16/1949,F,USA,California,Investment,3,No,Website
C0081,Individual,Sidney,Cline,7/24/1943,F,USA,California,Home,4,Yes,Website
C0082,Individual,Kaitlin,Owen,12/26/1981,F,USA,Virginia,Investment,5,No,Client
C0083,Individual,Issac,Edwards,10/29/1938,M,USA,California,Home,5,No,Website
C0084,Individual,Zaiden,Merritt,2/23/1948,M,USA,Wyoming,Home,3,No,Agency
C0085,Individual,Iris,Larsen,9/14/1966,M,USA,California,Home,4,Yes,Agency
C0086,Individual,Grace,Stein,12/20/1968,F,USA,California,Home,3,Yes,Website
C0087,Individual,Alessandra,Perry,5/15/1979,F,USA,California,Home,4,No,Agency
C0088,Individual,Jamal,Mueller,8/13/1936,M,USA,Oregon,Investment,2,No,Website
C0089,Individual,Irvin,Ellis,11/14/1949,M,USA,California,Home,3,No,Agency
C0090,Individual,Terry,Forbes,5/27/1982,M,USA,California,Home,5,No,Client
C0091,Individual,Jacqueline,Grant,11/13/1959,F,USA,California,Home,4,No,Website
C0092,Individual,Brock,Fischer,5/29/1971,M,USA,Kansas,Home,3,No,Website
C0093,Individual,Curtis,Howard,09-11-1962,M,USA,California,Home,2,No,Agency
C0094,Individual,Avah,Huang,4/23/1948,F,USA,California,Home,5,No,Website
C0095,Individual,Frank,Meyer,3/16/1964,M,USA,California,Home,3,Yes,Agency
C0096,Individual,Darien,Dorsey,12/27/1985,M,USA,California,Investment,3,Yes,Website
C0097,Individual,Franklin,Mack,6/18/1943,M,USA,Virginia,Home,5,Yes,Website
C0098,Individual,Elena,Petrova,6/22/1949,F,Russia,Saint Petersburg,Home,3,Yes,Agency
C0099,Individual,Jack,Hanson,12-01-1941,M,USA,California,Investment,4,No,Website
C0100,Individual,Emmett,Estes,06-05-1969,M,USA,California,Home,3,No,Website`;

fs.writeFileSync(path.join(__dirname, 'seed_part1.csv'), buyers_p1, 'utf8');
console.log('Seed part 1 ready');
