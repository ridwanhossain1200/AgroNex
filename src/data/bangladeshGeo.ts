export interface DistrictInfo {
  name: string;
  nameBn: string;
  division: string;
  upazilas: string[];
  majorMarkets: string[];
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  {
    name: 'Bogura',
    nameBn: 'বগুড়া',
    division: 'Rajshahi',
    upazilas: ['Bogura Sadar', 'Shibganj', 'Sherpur', 'Gabtali', 'Sariakandi', 'Dhunat', 'Kahaloo', 'Nandigram', 'Sonatala'],
    majorMarkets: ['Mahasthangarh Vegetable Arat (মহাস্থান আড়ত)', 'Gokul Haat', 'Raja Bazar', 'Fateh Ali Bazar']
  },
  {
    name: 'Dinajpur',
    nameBn: 'দিনাজপুর',
    division: 'Rangpur',
    upazilas: ['Dinajpur Sadar', 'Birganj', 'Birampur', 'Biral', 'Phulbari', 'Parbatipur', 'Bochaganj', 'Chirirbandar'],
    majorMarkets: ['Ranirbandar Paddy & Rice Arat', 'Railbazar Wholesale Market', 'Gopalganj Haat']
  },
  {
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    division: 'Rajshahi',
    upazilas: ['Paba', 'Godagari', 'Tanore', 'Mohanpur', 'Bagmara', 'Durgapur', 'Puthia', 'Charghat', 'Bagha'],
    majorMarkets: ['Baneswar Mango & Grain Market (বানেশ্বর হাট)', 'Masterpara Arat', 'Shaheb Bazar']
  },
  {
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    division: 'Mymensingh',
    upazilas: ['Mymensingh Sadar', 'Trishal', 'Muktagachha', 'Fulbaria', 'Bhaluka', 'Gafargaon', 'Gouripur', 'Haluaghat'],
    majorMarkets: ['Trishal Fish Arat (ত্রিশাল মাছের আড়ত)', 'Mechua Bazar Agri Wholesale', 'Choto Bazar']
  },
  {
    name: 'Jessore',
    nameBn: 'যশোর',
    division: 'Khulna',
    upazilas: ['Jessore Sadar', 'Jhikargachha', 'Chaugachha', 'Manirampur', 'Abhaynagar', 'Bagherpara', 'Keshabpur', 'Sharsha'],
    majorMarkets: ['Chowgacha Vegetable Market', 'Boro Bazar Agri Hub', 'Rajarhat Cattle Market']
  },
  {
    name: 'Rangpur',
    nameBn: 'রংপুর',
    division: 'Rangpur',
    upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachhara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
    majorMarkets: ['Mithapukur Haat', 'City Bazar Wholesale', 'Badarganj Grain Market']
  },
  {
    name: 'Cumilla',
    nameBn: 'কুমিল্লা',
    division: 'Chattogram',
    upazilas: ['Cumilla Adarsha Sadar', 'Burichang', 'Brahmanpara', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam'],
    majorMarkets: ['Chandina Vegetable Arat (চান্দিনা আড়ত)', 'Nimtoli Wholesale Market', 'Tomsom Bridge Bazar']
  },
  {
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    division: 'Dhaka',
    upazilas: ['Savar', 'Dhamrai', 'Keraniganj', 'Nawabganj', 'Dohar', 'Kawran Bazar', 'Jatrabari', 'Badamtoli'],
    majorMarkets: ['Kawran Bazar Wholesale (কাওরান বাজার)', 'Jatrabari Arat', 'Badamtoli Fruit Market', 'Savar Krishi Market']
  },
  {
    name: 'Kishoreganj',
    nameBn: 'কিশোরগঞ্জ',
    division: 'Dhaka',
    upazilas: ['Kishoreganj Sadar', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail'],
    majorMarkets: ['Bhairab Riverport Grain Arat', 'Katiadi Cattle Market', 'Baro Bazar']
  },
  {
    name: 'Barishal',
    nameBn: 'বরিশাল',
    division: 'Barishal',
    upazilas: ['Barishal Sadar', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Hizla'],
    majorMarkets: ['Port Road Fish Arat (পোর্ট রোড মাছের আড়ত)', 'Rupatali Wholesale Bazar', 'Gournadi Haat']
  },
  {
    name: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    division: 'Chattogram',
    upazilas: ['Patiya', 'Hathazari', 'Raozan', 'Fatikchhari', 'Sitakunda', 'Mirsharai', 'Anwara', 'Chandanaish', 'Boalkhali'],
    majorMarkets: ['Khatunganj Commodity Hub (খাতুনগঞ্জ আড়ত)', 'Reazuddin Bazar', 'Pahartali Grain Market']
  },
  {
    name: 'Sylhet',
    nameBn: 'সিলেট',
    division: 'Sylhet',
    upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Companiganj', 'Fenchuganj', 'Bishwanath', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Zakiganj'],
    majorMarkets: ['Kazirbazar Wholesale Market (ক্বীন ব্রিজ/কাজীরবাজার)', 'Subidbazar', 'Bishwanath Haat']
  }
];

export const SOIL_TYPES = [
  'Alluvial (পলি)',
  'Clay (এঁটেল)',
  'Loam (দোআঁশ)',
  'Sandy Loam (বেলে দোআঁশ)',
  'Saline (লবণাক্ত)'
] as const;

export const SEASONS = [
  'Rabi (রবি - Winter / Nov-Feb)',
  'Kharif-1 (খরিপ-১ - Summer / Mar-Jun)',
  'Kharif-2 (খরিপ-২ - Monsoon / Jul-Oct)'
] as const;

