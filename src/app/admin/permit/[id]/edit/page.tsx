"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditPermitPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permit, setPermit] = useState<Record<string, any> | null>(null);
  const [permitId, setPermitId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => {
      setPermitId(id);
      fetch(`/api/permit/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch permit");
          return res.json();
        })
        .then((data) => {
          setPermit(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to load permit data.");
          router.push("/admin/dashboard");
        });
    });
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/permit/${permitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        alert("Failed to update permit.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!permit) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Permit</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-xl border border-gray-200 p-8 space-y-8">
        
        {/* Basic Permit Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Permit Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permit Number</label>
              <input name="permitNumber" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.permitNumber} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permit Type</label>
              <input name="permitType" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.permitType} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input name="issueDate" type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={formatDate(permit.issueDate)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input name="expiryDate" type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={formatDate(permit.expiryDate)} />
            </div>
          </div>
        </section>

        {/* Worker Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Worker Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Worker Name</label>
              <input name="workerName" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.workerName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID / Iqama Number</label>
              <input name="idNumber" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.idNumber} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input name="nationality" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.nationality} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <input name="profession" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.profession} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" required className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white" defaultValue={permit.gender}>
                <option value="ذكر">ذكر (Male)</option>
                <option value="أنثى">أنثى (Female)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
              <input name="dob" type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.dob ? formatDate(permit.dob) : ""} />
            </div>
          </div>
        </section>

        {/* Facility Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Facility Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider Facility Name</label>
              <input name="facilityName" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.facilityName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility Number</label>
              <input name="facilityNumber" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.facilityNumber} />
            </div>
          </div>
        </section>

        {/* Beneficiary Facility Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Beneficiary Data (Optional for 2nd Permit Type)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Facility Name</label>
              <input name="beneficiaryFacilityName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.beneficiaryFacilityName || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Facility Number</label>
              <input name="beneficiaryFacilityNumber" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.beneficiaryFacilityNumber || ""} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Description</label>
              <input name="contractDescription" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.contractDescription || ""} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Locations</label>
              <input name="workLocations" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue={permit.workLocations || ""} />
            </div>
          </div>
        </section>

        {/* Security Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Security</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Password Protection</label>
            <p className="text-sm text-gray-500 mb-3">
              {permit.passwordHash ? "This permit is currently password protected." : "This permit is currently public."} Leave blank to keep unchanged, or enter a new password.
            </p>
            <input name="password" type="password" className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Leave blank to keep unchanged" />
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/admin/dashboard"
            className="text-gray-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}
