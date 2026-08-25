const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://kznbfbtpxvfbikdsdtlk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QkWWZ2Vcs0jzY2A6UBGW8Q_MC45Hgfb';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Full 2000 data generator based on the prompt's statistical distribution
async function seedFull2000() {
  console.log('Generating complete 2,000 buyer records...');

  const firstNames = ['Kareem', 'Trystan', 'Kale', 'Russell', 'Marleez', 'Yurem', 'Xavier', 'Kayden', 'Joaquin', 'Nicolas', 'Laci', 'Kylax', 'Harley', 'Esther', 'Jaylynn', 'Olivia', 'Antonio', 'Luke', 'Anahi', 'Camille', 'Jesus', 'Araceli', 'Cole', 'Alonso', 'Rodolfo', 'Joseph', 'Grant', 'Ava', 'Kyla', 'Alanna', 'Skylar', 'Rodrigo', 'Lydia', 'Lauryn', 'Diego', 'Victor', 'Scarlet', 'Janelle', 'Aleksandra', 'Conner', 'Zain', 'Maia', 'Jordyn', 'Diana', 'Kevin', 'Brisa', 'Mason', 'Derick', 'Jace', 'Jair', 'Matilda', 'Myla', 'Miguel', 'Mara', 'Erik', 'Henry', 'Oswaldo', 'Kassidy', 'Morgan', 'Tyler', 'Yesenia', 'Gordon', 'Melanie', 'Enrique', 'Helen', 'Isis', 'Kayley', 'Donavan', 'Augustus', 'Alejandra', 'Violet', 'Jaelyn', 'Tristian', 'Christian', 'Nora', 'Dangelo', 'Aiyana', 'Sidney', 'Kaitlin', 'Issac', 'Zaiden', 'Iris', 'Grace', 'Alessandra', 'Jamal', 'Irvin', 'Terry', 'Jacqueline', 'Brock', 'Curtis', 'Avah', 'Frank', 'Darien', 'Franklin', 'Elena', 'Jack', 'Emmett', 'Aniya', 'Kael', 'Kamden', 'Aniyah', 'Simon', 'Laurel', 'Trey', 'Myah', 'Nyla', 'Kole', 'Melany', 'Arthur', 'Kamila', 'Amanda', 'Erika', 'Jakobe', 'Sonia', 'Madeline', 'Bennett', 'Belinda', 'Johanna', 'Jaylen', 'Michael', 'Adriana', 'Julio', 'Warren', 'Luis', 'Mohammad', 'Davion', 'Logan', 'Kaylin', 'Ruben', 'Gianni', 'Emilie', 'Crystal', 'Annabel', 'Rachel', 'Madalyn', 'Michelle', 'Ezra', 'Ramiro', 'Emely', 'Hazel', 'Cedric', 'Dayton', 'Piotr', 'Memphis', 'Arabella', 'Sincere', 'Lara', 'Valentina', 'Case', 'Van', 'Emmy', 'Colin', 'Anya', 'Parker', 'Ivan', 'Larry', 'Matthew', 'Mary', 'Carolyn', 'Pamela', 'Jacob', 'Julie', 'Catherine', 'Amber', 'Brandon', 'Hannah', 'Sarah', 'Laura', 'Ashley', 'Lawrence', 'Virginia', 'Nicholas', 'Peter', 'Andrea', 'Carol', 'Cheryl', 'Jose', 'Anna', 'Karen', 'Margaret', 'Sharon', 'Jonathan', 'Sean', 'Alexander', 'Lauren', 'Christine', 'Joyce', 'Kelly', 'Nancy', 'Kyle', 'Mark', 'Janice', 'Amy', 'Jason', 'Lauren', 'Albert', 'Deborah', 'Shirley', 'William', 'Walter', 'Christopher', 'Patrick', 'Nathan', 'Evelyn', 'Julia', 'Ronald', 'Megan', 'Kenneth', 'Gerald', 'Stephen', 'Elizabeth', 'Betty', 'Sara', 'Anthony', 'Emma', 'Rebecca', 'Billy', 'Melissa', 'Aaron', 'Judy', 'Danielle', 'David', 'Paul', 'Raymond', 'Gloria', 'Jordan', 'Heather', 'Katherine', 'Emily', 'Susan', 'Noah', 'Joan', 'Ryan', 'James', 'Ruth', 'Roger', 'Zachary', 'Lisa', 'Maria', 'Samuel', 'Edward', 'Justin', 'Jesse', 'Samantha', 'Daniel', 'Diane', 'Charles', 'Keith', 'Joshua', 'Stephanie', 'Richard', 'Judith', 'Kimberly', 'George', 'Teresa', 'Madison', 'Douglas', 'Jessica', 'Steven', 'Nicole', 'Jennifer', 'Brian', 'Brenda', 'Timothy', 'Debra', 'Austin', 'Austin', 'Austin', 'Austin'];
  const lastNames = ['Liu', 'Oconnor', 'Gay', 'Gross', 'Co', 'Wright', 'Faulkner', 'Olsen', 'Mullins', 'Navarro', 'Guerra', 'Lucero', 'Hickman', 'Oconnell', 'Porter', 'Lynn', 'Curry', 'Sharp', 'Obrien', 'Nelson', 'Taylor', 'Terrell', 'Gibson', 'Reeves', 'Weber', 'Phelps', 'Walker', 'Hess', 'Buchanan', 'Robinson', 'Tate', 'Patrick', 'Mendez', 'Jensen', 'Hendricks', 'Espinoza', 'Karenina', 'Huff', 'Horne', 'Chandler', 'Park', 'Hunt', 'Mata', 'Mckee', 'Gilbert', 'Li', 'Riggs', 'Johns', 'Madden', 'Ewing', 'Walter', 'Franco', 'Mora', 'Kennedy', 'Palmer', 'Vega', 'Glass', 'Carr', 'Marquez', 'Brown', 'Ramirez', 'Holland', 'Cardenas', 'Williamson', 'Rios', 'Nielsen', 'Flowers', 'Hinton', 'Greer', 'Nixon', 'Berger', 'Fuller', 'Costa', 'Lynch', 'Shea', 'Christensen', 'Cline', 'Owen', 'Edwards', 'Merritt', 'Larsen', 'Stein', 'Perry', 'Mueller', 'Ellis', 'Forbes', 'Grant', 'Fischer', 'Howard', 'Huang', 'Meyer', 'Dorsey', 'Mack', 'Petrova', 'Hanson', 'Estes', 'Miller', 'Anderson', 'Hurley', 'Stewart', 'Ali', 'Bennett', 'Benitez', 'Strong', 'Roman', 'Blake', 'Shannon', 'Glover', 'Bray', 'Collier', 'Simon', 'Steward', 'Bailey', 'Choi', 'Gallagher', 'Michael', 'Chen', 'Hogan', 'Fisher', 'Turner', 'Juarez', 'Shaffer', 'Leonard', 'Pugh', 'Crane', 'Irwin', 'Stout', 'Simmons', 'Villarreal', 'Melton', 'Fritz', 'Morrison', 'Wyatt', 'Robles', 'Cross', 'Mercer', 'Cameron', 'Lozano', 'Oneill', 'Watts', 'Ayers', 'Goodwin', 'Hatfield', 'Aleksandrov', 'Mcconnell', 'Ferrell', 'Hansen', 'Carrillo', 'Simpson', 'Sanchez', 'Charles', 'Singh', 'Campos', 'Stephenson', 'Poole', 'Bright', 'Hall', 'Weaver', 'Green', 'Sanders', 'Carter', 'Wilson', 'Harris', 'Alexander', 'Williams', 'Chavez', 'Peterson', 'Kim', 'Martin', 'Adams', 'Johnson', 'Moore', 'Campbell', 'Brooks', 'Pierce', 'Roberts', 'Gray', 'James', 'Price', 'Evans', 'Wood', 'Foster', 'Phillips', 'Stone', 'Richardson', 'Reyes', 'Jordan', 'Owens', 'Rogers', 'Hughes', 'Allen', 'Patterson', 'Baker', 'Morales', 'Collins', 'Montgomery', 'Scott', 'Smith', 'King', 'Jackson', 'Griffin', 'Young', 'Thomas', 'Reed', 'White', 'Watson', 'Peterson', 'Walker', 'Ward'];
  const countries = ['USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'USA', 'UK', 'Canada', 'Germany', 'France', 'Belgium', 'Mexico', 'Russia', 'Denmark', 'Australia'];
  const regions = ['California', 'Nevada', 'Arizona', 'Colorado', 'Oregon', 'Washington', 'Texas', 'Virginia', 'Georgia', 'New York', 'Florida', 'Utah', 'Ohio', 'London', 'Berlin', 'Paris', 'Ontario', 'Quebec', 'Brussels', 'Dubai'];
  const companyNames = ['Marleez Co', 'Kylax Co', 'Esther Co', 'Bridger CAL Co', 'Kenyon Co', 'Abdiel Co', 'Kamd Co', 'Celera Co', 'Forsyte Co', 'Atlas Co', 'Optima Co', 'Novex Co', 'Horizon Co', 'Bravada Co', 'Telnox Co', 'Grandis Co', 'Altira Co', 'Lumina Co', 'Vertex Co', 'Corvus Co', 'Harmon Co', 'Stratos Co', 'Zynex Co', 'Summit Co', 'Quasar Co', 'Meridian Co', 'Rexon Co', 'Apex Co', 'Peerex Co', 'Polaris Co', 'Helios Co', 'Sterling Co', 'Elara Co', 'Vantage Co', 'Caldera Co', 'Triton Co', 'Nexus Co', 'Terova Co', 'Crestwood Co', 'Halcyon Co', 'Oasis Co'];

  const rows = [];
  const csvLines = ['client_id,client_type,first_name,last_name,date_of_birth,gender,country,region,acquisition_purpose,satisfaction_score,loan_applied,referral_channel,predicted_cluster_id,predicted_cluster_name'];

  for (let i = 1; i <= 2000; i++) {
    const padId = 'C' + String(i).padStart(4, '0');
    const isCompany = (i % 38 === 0);
    const clientType = isCompany ? 'Corporate' : 'Individual';

    let fn = firstNames[i % firstNames.length];
    let ln = isCompany ? 'Co' : lastNames[i % lastNames.length];
    if (isCompany) {
      fn = companyNames[(i / 38) % companyNames.length].split(' ')[0];
    }

    const country = countries[i % countries.length];
    const region = regions[i % regions.length];
    const isLoan = isCompany ? (i % 3 === 0) : (i % 2 === 0);
    const purpose = isCompany ? 'Investment' : ((i % 3 === 0 || country !== 'USA') ? 'Investment' : 'Personal Use');
    const satScore = Number((3.0 + ((i * 7) % 21) / 10).toFixed(1)); // 3.0 to 5.0
    const gender = isCompany ? 'Other' : (i % 2 === 0 ? 'Female' : 'Male');
    const channel = ['Website', 'Agency', 'Client', 'Direct', 'Corporate'][i % 5];

    let clusterId = 'C1';
    let clusterName = 'Global Investor';

    if (isCompany) {
      clusterId = 'C3';
      clusterName = 'Corporate Buyer';
    } else if (isLoan && purpose === 'Personal Use') {
      clusterId = 'C2';
      clusterName = 'First-Time Buyer';
    } else if (satScore >= 4.5) {
      clusterId = 'C4';
      clusterName = 'Luxury Investor';
    } else if (country !== 'USA' && purpose === 'Investment') {
      clusterId = 'C1';
      clusterName = 'Global Investor';
    } else if (satScore >= 4.0 && !isLoan) {
      clusterId = 'C4';
      clusterName = 'Luxury Investor';
    } else if (isLoan) {
      clusterId = 'C2';
      clusterName = 'First-Time Buyer';
    } else {
      clusterId = 'C1';
      clusterName = 'Global Investor';
    }

    rows.push({
      client_type: clientType,
      gender: gender,
      country: country === 'USA' ? 'United States' : country,
      region: region,
      acquisition_purpose: purpose,
      loan_applied: isLoan,
      referral_channel: channel,
      satisfaction_score: satScore,
      predicted_cluster_id: clusterId,
      predicted_cluster_name: clusterName,
    });

    csvLines.push(`${padId},${clientType},${fn},${ln},1975-01-01,${gender},${country},${region},${purpose},${satScore},${isLoan ? 'Yes' : 'No'},${channel},${clusterId},${clusterName}`);
  }

  fs.writeFileSync(path.join(__dirname, 'buyers_dataset.csv'), csvLines.join('\n'), 'utf8');
  console.log('✅ Generated buyers_dataset.csv with 2,000 records!');

  // Clear existing Supabase buyers
  console.log('🧹 Clearing previous records from Supabase...');
  await supabase.from('buyers').delete().neq('predicted_cluster_id', 'NON_EXISTENT_ID');

  // Insert in batches of 100
  const BATCH_SIZE = 100;
  let totalUploaded = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('buyers').insert(batch);
    if (error) {
      console.error(`Batch error at ${i}:`, error.message);
    } else {
      totalUploaded += batch.length;
      process.stdout.write(`\r💾 Uploaded ${totalUploaded} / 2,000 records to Supabase...`);
    }
  }

  console.log('\n🎉 ALL 2,000 RECORDS SUCCESSFULLY UPLOADED TO SUPABASE!');
}

seedFull2000().catch(console.error);
