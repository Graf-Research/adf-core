import fs from 'fs';
import { SAResult } from './semantic-analysis/sem-analysis';
import { JSONSpecificationToADF, parse, parseFromFileItems, parseString } from './index';

if (!process.argv[2]) {
  throw new Error(`argv[2] cannot be empty`);
}

function main(filename: string) {
  try {
    const result: SAResult = parseString(
      `
api post /login {
  description Login dengan nomor hp
  body {
    data schema LoginPayload {
      nomor_hp string required
    } required
  }
  return schema.OTPHashResponse required
}

api post /forgot-password {
  description Kirim email lupa password jika email ditemukan, abaikan jika email tidak ditemukan.
  body {
    email string required
  }
  return boolean required
}

api post /onboarding/accept-snk {
  description Finalisasi onboarding, setuju SnK
  headers {
    authorization string required
  }
  body {
    __nobody string
  }
  return boolean required
}

api post /onboarding/data-diri {
  description Submit data onboarding data diri
  headers {
    authorization string required
  }
  body {
    data schema OnboardingDataDiriPayload {
      fullname string required
      email string required
      tanggal_lahir string required
      domisili string
    } required
  }
  return boolean required
}

api post /onboarding/photo-username {
  description Submit data onboarding photo & username
  headers {
    authorization string required
  }
  body {
    data schema OnboardingPhotoUsernamePayload {
      username string required
      profile_picture_url string
    } required
  }
  return boolean required
}

api post /register {
  description Daftar dengan nomor hp
  body {
    data schema RegisterPayload {
      nomor_hp string required
    } required
  }
  return schema.OTPHashResponse required
}

api post /reset-password/:token {
  description Reset password berdasarkan token dengan password baru
  path {
    token string required
  }
  body {
    data schema ResetPasswordPayload {
      password string required
      confirm_password string required
    } required
  }
  return boolean required
}

api get /reset-password/:token/is-valid {
  description Periksa apakah token reset password valid
  path {
    token string required
  }
  return boolean required
}

api post /verify-email/:token {
  description Verifikasi email berdasarkan token pada tautan verifikasi email
  path {
    token string required
  }
  return schema.AuthResponse required
}

api post /verify-otp {
  description Verifikasi kode OTP
  body {
    data schema OTPSubmissionPayload {
      hash string required
      type string required
      code string required
    } required
  }
  return schema.AuthResponse required
}

      `, undefined, {
        model: {
          ignoreMissingEnum: true,
          ignoreTableRelation: true
        },
        schema: {
          ignoreMissingEnum: true,
          ignoreMissingSchema: true,
          ignoreMissingTable: true
        }
      }
    );
    // const result: SAResult = await parse('./sample.adf');
    console.log(result);
    // console.log(JSONSpecificationToADF(result));
  } catch (parse_error: any) {
    console.error(parse_error)
  }
};
main(process.argv[2]);

