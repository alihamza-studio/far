import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const permit = await prisma.permit.findUnique({ where: { id } });

    if (!permit) {
      return NextResponse.json({ error: "Permit not found" }, { status: 404 });
    }

    return NextResponse.json(permit);
  } catch (error) {
    console.error("Error fetching permit:", error);
    return NextResponse.json(
      { error: "Failed to fetch permit" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    // Hash password if provided, or keep existing
    let passwordHash: string | null | undefined = undefined;
    if (data.password === "") {
      // Explicitly clear password protection
      passwordHash = null;
    } else if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    const updateData: Record<string, unknown> = {
      permitNumber: data.permitNumber,
      permitType: data.permitType,
      issueDate: new Date(data.issueDate),
      expiryDate: new Date(data.expiryDate),
      workerName: data.workerName,
      nationality: data.nationality,
      gender: data.gender,
      idNumber: data.idNumber,
      profession: data.profession,
      dob: data.dob ? new Date(data.dob).toISOString() : null,
      facilityName: data.facilityName,
      facilityNumber: data.facilityNumber,
      beneficiaryFacilityName: data.beneficiaryFacilityName || null,
      beneficiaryFacilityNumber: data.beneficiaryFacilityNumber || null,
      contractDescription: data.contractDescription || null,
      workLocations: data.workLocations || null,
    };

    if (passwordHash !== undefined) {
      updateData.passwordHash = passwordHash;
    }

    const permit = await prisma.permit.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(permit);
  } catch (error) {
    console.error("Error updating permit:", error);
    return NextResponse.json(
      { error: "Failed to update permit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.permit.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting permit:", error);
    return NextResponse.json(
      { error: "Failed to delete permit" },
      { status: 500 }
    );
  }
}
