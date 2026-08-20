require.extensions['.jsx'] = require.extensions['.js'];
require("dotenv").config();
const { sequelize, User, Organization, Category, Event } = require("../models");

async function seed() {
  await sequelize.sync({ force: true });

  const categories = await Category.bulkCreate([
    { name: "Lingkungan" },
    { name: "Pendidikan" },
    { name: "Bencana Alam" },
    { name: "Kesehatan" },
  ]);

  const admin = await User.create({
    full_name: "Admin Volunteer",
    email: "admin@volunteer.id",
    password_hash: "admin123",
    role: "admin",
  });

  const orgUser = await User.create({
    full_name: "Budi Santoso",
    email: "org@volunteer.id",
    password_hash: "org12345",
    role: "organization",
  });

  const org = await Organization.create({
    user_id: orgUser.id,
    org_name: "Komunitas Peduli Bandung",
    description: "Komunitas volunteer aktif untuk isu lingkungan dan sosial di Bandung.",
    address: "Jl. Dago No. 10, Bandung",
    is_verified: true,
  });

  const volunteer = await User.create({
    full_name: "Siti Aminah",
    email: "volunteer@volunteer.id",
    password_hash: "vol12345",
    role: "volunteer",
  });

  await Event.bulkCreate([
    {
      organization_id: org.id,
      category_id: categories[0].id,
      title: "Bersih-Bersih Sungai Cikapundung",
      description: "Kegiatan gotong royong membersihkan sampah di sepanjang Sungai Cikapundung.",
      location: "Cikapundung, Bandung",
      quota: 30,
      event_date: "2026-09-05",
      start_time: "07:00:00",
      end_time: "11:00:00",
    },
    {
      organization_id: org.id,
      category_id: categories[1].id,
      title: "Mengajar Baca Tulis untuk Anak Jalanan",
      description: "Program pendampingan belajar membaca dan menulis untuk anak-anak di sekitar kota.",
      location: "Balai RW 05, Bandung",
      quota: 15,
      event_date: "2026-09-12",
      start_time: "09:00:00",
      end_time: "12:00:00",
    },
  ]);

  console.log("✅ Seed selesai. Akun demo:");
  console.log("   Admin      : admin@volunteer.id / admin123");
  console.log("   Organisasi : org@volunteer.id / org12345");
  console.log("   Volunteer  : volunteer@volunteer.id / vol12345");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
