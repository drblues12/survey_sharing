import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbTrigger } from '@nebular/theme';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  showPassword = false;
  fields: {email: {email: string, correct: boolean | undefined, error: string},
            username: {username: string, correct: boolean | undefined, error: string},
            password: {password: string, correct: boolean | undefined, error: string},
            name: {name: string, correct: boolean | undefined, error: string},
            surname: {surname: string, correct: boolean | undefined, error: string},
            age: {age: number | undefined, correct: boolean | undefined, error: string},
            gender: {gender: string, correct: boolean | undefined, error: string},
            country: {country: string, correct: boolean | undefined, error: string}}
            =
            {email: {email: "", correct: undefined, error: ""},
            username: {username: "", correct: undefined, error: ""},
            password: {password: "", correct: undefined, error: ""},
            name: {name: "", correct: undefined, error: ""},
            surname: {surname: "", correct: undefined, error: ""},
            age: {age: undefined, correct: undefined, error: ""},
            gender: {gender: "", correct: undefined, error: ""},
            country: {country: "", correct: undefined, error: ""}};
  tooltipTrigger: NbTrigger = NbTrigger.HOVER;

  constructor(public globalService: GlobalService) { }

  ngOnInit(): void {
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  register(){
    this.globalService.userService.createUser(this.fields.username.username, this.fields.email.email,
      this.fields.name.name, this.fields.surname.surname, this.fields.age.age+'', this.fields.gender.gender,
      this.fields.country.country).subscribe(responseMessage => {
        alert(responseMessage.message);
        this.globalService.navigate('login',null);
    })
  }

  onInputChangeEmail(event: Event): void{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(this.fields.email.email.trim()==""){
      this.fields.email.correct = false;
      this.fields.email.error = "Email cannot be blank";
      return;
    }
    if(!emailPattern.test(this.fields.email.email)){
      this.fields.email.correct = false;
      this.fields.email.error = "Invalid email format";
      return;
    }
    this.globalService.userService.findUserByEmail(this.fields.email.email).subscribe(responseMessage => {
      if(responseMessage.object!=null){
        this.fields.email.correct = false;
        this.fields.email.error = "Email already in use";
        return;
      }
      this.fields.email.correct = true;
      this.fields.email.error = "";
    })
  }

  onInputChangeUsername(event: Event): void{
    if(this.fields.username.username==""){
      this.fields.username.correct = false;
      this.fields.username.error = "Username cannot be blank";
      return;
    }
    if (this.fields.username.username.length < 3 || this.fields.username.username.length > 15) {
      this.fields.username.correct = false;
      this.fields.username.error = "Username must be between 3 and 15 characters";
      return;
    }
    this.globalService.userService.findUserByUsername(this.fields.username.username).subscribe(responseMessage => {
      if(responseMessage.object!=null){
        this.fields.username.correct = false;
        this.fields.username.error = "Username already in use";
        return;
      }
      this.fields.username.correct = true;
      this.fields.username.error = "";
    })
  }

  onInputChangePassword(event: Event): void{
    const passwordPattern = /^(?=.*\d).{8,}$/;
    if (!passwordPattern.test(this.fields.password.password)) {
      this.fields.password.correct = false;
      this.fields.password.error = "Password must be at least 8 characters long and contain at least one number";
      return;
    }
    this.fields.password.correct = true;
      this.fields.password.error = "";
  }

  onInputChangeName(event: Event): void{
    const namePattern = /^[A-Za-z]+$/;
    if(this.fields.name.name==""){
      this.fields.name.correct = false;
      this.fields.name.error = "Name cannot be blank";
      return;
    }
    if(!namePattern.test(this.fields.name.name)){
      this.fields.name.correct = false;
      this.fields.name.error = "Invalid name format";
      return;
    }
    this.fields.name.correct = true;
    this.fields.name.error = "";
  }

  onInputChangeSurname(event: Event): void{
    const surnamePattern = /^[A-Za-z]+$/;
    if(this.fields.surname.surname==""){
      this.fields.surname.correct = false;
      this.fields.surname.error = "Surname cannot be blank";
      return;
    }
    if(!surnamePattern.test(this.fields.surname.surname)){
      this.fields.surname.correct = false;
      this.fields.surname.error = "Invalid surname format";
      return;
    }
    this.fields.surname.correct = true;
    this.fields.surname.error = "";
  }

  onInputChangeAge(event: Event): void{
    const agePattern = /^[0-9]+$/;
    if(this.fields.age.age==undefined){
      this.fields.age.correct = false;
      this.fields.age.error = "Age cannot be blank";
      return;
    }
    if(!agePattern.test(this.fields.age.age+'')){
      this.fields.age.correct = false;
      this.fields.age.error = "Invalid age format";
      return;
    }
    this.fields.age.correct = true;
    this.fields.age.error = "";
  }

  onInputChangeGender(event: Event): void{
    if(this.fields.gender.gender==""){
      this.fields.gender.correct = false;
      this.fields.gender.error = "Gender cannot be blank";
      return;
    }
    this.fields.gender.correct = true;
    this.fields.gender.error = "";
  }

  onInputChangeCountry(event: Event): void{
    if(this.fields.country.country==""){
      this.fields.country.correct = false;
      this.fields.country.error = "Country cannot be blank";
      return;
    }
    this.fields.country.correct = true;
    this.fields.country.error = "";
  }

  getStatus(correct: boolean | undefined): string {
    switch(correct){
      case undefined:
        return "basic";
      case true:
        return "success";
      case false:
        return "danger";
      default:
        return "basic";
    }
  }

  getTooltipIcon(correct: boolean | undefined): string {
    switch(correct){
      case undefined:
        return "";
      case true:
        return "checkmark-circle-2";
      case false:
        return "close-circle";
      default:
        return "";
    }
  }

  countries: { code: string, name: string }[] = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AS', name: 'American Samoa' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AI', name: 'Anguilla' },
    { code: 'AQ', name: 'Antarctica' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AW', name: 'Aruba' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BM', name: 'Bermuda' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BV', name: 'Bouvet Island' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IO', name: 'British Indian Ocean Territory' },
    { code: 'BN', name: 'Brunei Darussalam' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'KY', name: 'Cayman Islands' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CX', name: 'Christmas Island' },
    { code: 'CC', name: 'Cocos (Keeling) Islands' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Congo, the Democratic Republic of the' },
    { code: 'CK', name: 'Cook Islands' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CI', name: "Cote D'Ivoire" },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FK', name: 'Falkland Islands (Malvinas)' },
    { code: 'FO', name: 'Faroe Islands' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GF', name: 'French Guiana' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'TF', name: 'French Southern Territories' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GI', name: 'Gibraltar' },
    { code: 'GR', name: 'Greece' },
    { code: 'GL', name: 'Greenland' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GP', name: 'Guadeloupe' },
    { code: 'GU', name: 'Guam' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GG', name: 'Guernsey' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HM', name: 'Heard Island and Mcdonald Islands' },
    { code: 'VA', name: 'Holy See (Vatican City State)' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran, Islamic Republic of' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IM', name: 'Isle of Man' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JE', name: 'Jersey' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KP', name: "Korea, Democratic People's Republic of" },
    { code: 'KR', name: 'Korea, Republic of' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: "Lao People's Democratic Republic" },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libyan Arab Jamahiriya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MO', name: 'Macao' },
    { code: 'MK', name: 'Macedonia, the Former Yugoslav Republic of' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MQ', name: 'Martinique' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'YT', name: 'Mayotte' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia, Federated States of' },
    { code: 'MD', name: 'Moldova, Republic of' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MS', name: 'Montserrat' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'AN', name: 'Netherlands Antilles' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NU', name: 'Niue' },
    { code: 'NF', name: 'Norfolk Island' },
    { code: 'MP', name: 'Northern Mariana Islands' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestinian Territory, Occupied' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PN', name: 'Pitcairn' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RE', name: 'Reunion' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russian Federation' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'SH', name: 'Saint Helena' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'PM', name: 'Saint Pierre and Miquelon' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen' },
    { code: 'SZ', name: 'Swaziland' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syrian Arab Republic' },
    { code: 'TW', name: 'Taiwan, Province of China' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania, United Republic of' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TK', name: 'Tokelau' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TC', name: 'Turks and Caicos Islands' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'UM', name: 'United States Minor Outlying Islands' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Viet Nam' },
    { code: 'VG', name: 'Virgin Islands, British' },
    { code: 'VI', name: 'Virgin Islands, U.S.' },
    { code: 'WF', name: 'Wallis and Futuna' },
    { code: 'EH', name: 'Western Sahara' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' }
    ];


}
