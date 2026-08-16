import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  if (!isConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary n'est pas encore configuré. Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.local, puis redémarrez le site.",
      },
      { status: 503 }
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez une image JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop lourde (8 Mo maximum)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "abd-culinary-events" },
        (error, uploadResult) => {
          if (error || !uploadResult) return reject(error);
          resolve(uploadResult as { secure_url: string });
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    const detail =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "erreur inconnue";
    return NextResponse.json(
      { error: `L'envoi de l'image a échoué (${detail}). Vérifiez vos identifiants Cloudinary dans .env.local.` },
      { status: 500 }
    );
  }
}
