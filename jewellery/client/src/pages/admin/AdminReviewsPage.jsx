import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, EyeOff, Trash2 } from 'lucide-react';
import { reviewsAPI } from '../../services/api';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewsAPI.getAllAdmin();
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id) => {
    try {
      const res = await reviewsAPI.toggleApproval(id);
      if (res.data.success) {
        fetchReviews();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating review approval');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Quality & Feedback
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-900">
            Patron Reviews Moderation ({reviews.length})
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-chocolate-800">
            <thead className="bg-chocolate-900 text-gold-300 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Masterpiece</th>
                <th className="p-4">Reviewer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Commentary</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-chocolate-500">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-chocolate-500">
                    No customer reviews to moderate.
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-ivory-50/60 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={rev.product?.images?.[0]?.url || ''}
                        alt=""
                        className="w-10 h-10 object-cover rounded border bg-ivory-100"
                      />
                      <div>
                        <strong className="font-semibold text-chocolate-900 block line-clamp-1">
                          {rev.product?.name || 'Jewel'}
                        </strong>
                        <span className="text-chocolate-500 text-[11px]">SKU: {rev.product?.sku}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <strong className="block text-chocolate-900 font-semibold">{rev.name}</strong>
                      <span className="text-chocolate-500 text-[11px]">{rev.user?.email}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-0.5 text-gold-600">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <strong className="block text-chocolate-900 font-semibold line-clamp-1">
                        {rev.title}
                      </strong>
                      <p className="text-chocolate-600 line-clamp-2 text-[11px] font-light">
                        {rev.comment}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rev.isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rev.isApproved ? 'Visible Online' : 'Hidden'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleApproval(rev._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          rev.isApproved
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        {rev.isApproved ? 'Hide Review' : 'Approve Review'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
