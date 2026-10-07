import React, { useState } from 'react';
import { Trek, Review, UserProfile, Season } from '../types';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle, 
  MessageSquarePlus, 
  User, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';

interface ReviewsSectionProps {
  trek: Trek;
  reviews: Review[];
  onAddReview: (newReview: Review) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  trek,
  reviews,
  onAddReview,
  currentUser,
  onOpenAuth
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});

  // Form State
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formAuthorName, setFormAuthorName] = useState(currentUser?.name || '');
  const [formLocation, setFormLocation] = useState('Delhi, India');
  const [formTrailCondition, setFormTrailCondition] = useState('Clear and well marked');
  const [formSeason, setFormSeason] = useState<Season>(trek.bestSeasons[0] || 'Autumn');

  const filteredReviews = reviews.filter((r) => {
    if (r.trekId !== trek.id) return false;
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formComment.trim()) {
      alert('Please add a title and detailed experience in your review.');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      trekId: trek.id,
      authorName: formAuthorName || 'Anonymous Trekker',
      authorLocation: formLocation || 'India',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: formRating,
      date: 'Just now',
      title: formTitle,
      comment: formComment,
      verifiedTrekker: true,
      helpfulCount: 0,
      trailCondition: formTrailCondition,
      recommendedSeason: formSeason
    };

    onAddReview(newRev);
    setShowReviewModal(false);
    setFormTitle('');
    setFormComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Rating Breakdown */}
      <div className="bg-[#F3F1EA] rounded-2xl p-6 border border-[#E8E4D9]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Score */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#1E2822] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
              <span className="text-3xl font-extrabold text-[#86EFAC] font-heading">{trek.rating}</span>
              <div className="flex text-amber-400 text-[10px] mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#2D3633] font-heading">Hiker Community Ratings</h3>
              <p className="text-xs text-[#5C6662] mt-0.5">
                Based on <span className="font-semibold text-[#2D3633]">{reviews.filter((r) => r.trekId === trek.id).length || trek.reviewsCount} verified reviews</span> from Himachal & Uttarakhand expeditions.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#4A6741]/10 text-[#2D4F1E] font-semibold border border-[#4A6741]/20">
                  98% Recommended
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#E8E4D9] text-[#2D3633] font-medium">
                  IMF Standard Safety: 5/5
                </span>
              </div>
            </div>
          </div>

          {/* Write a review button */}
          <div>
            <button
              id="open-write-review-modal-btn"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth();
                } else {
                  setShowReviewModal(true);
                }
              }}
              className="bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#FDFCF7]" />
              <span>Write Hiker Review</span>
            </button>
          </div>
        </div>

        {/* Rating filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#E8E4D9]">
          <span className="text-xs font-semibold text-[#5C6662] mr-1">Filter by:</span>
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              filterRating === 'all'
                ? 'bg-[#4A6741] text-white'
                : 'bg-white border border-[#E8E4D9] text-[#5C6662] hover:bg-[#F3F1EA]'
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() => setFilterRating(stars)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                filterRating === stars
                  ? 'bg-[#4A6741] text-white'
                  : 'bg-white border border-[#E8E4D9] text-[#5C6662] hover:bg-[#F3F1EA]'
              }`}
            >
              <span>{stars}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 bg-[#F3F1EA] rounded-2xl border border-[#E8E4D9] text-[#5C6662]">
            <p className="text-sm">No reviews found for this filter.</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-2 text-[#4A6741] font-bold text-xs underline"
            >
              Be the first to write a review!
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isHelpful = helpfulMap[rev.id];
            const currentHelpfulCount = rev.helpfulCount + (isHelpful ? 1 : 0);

            return (
              <div
                key={rev.id}
                id={`review-card-${rev.id}`}
                className="bg-white rounded-2xl p-5 border border-[#E8E4D9] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.authorAvatar}
                      alt={rev.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E8E4D9]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#2D3633]">{rev.authorName}</span>
                        {rev.verifiedTrekker && (
                          <span className="flex items-center gap-0.5 text-[10px] text-[#2D4F1E] font-semibold bg-[#4A6741]/10 px-1.5 py-0.5 rounded border border-[#4A6741]/20">
                            <CheckCircle className="w-3 h-3" />
                            Verified Trekker
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#8B9691]">{rev.authorLocation} • {rev.date}</span>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-[#D1CDC0]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#2D3633] text-sm">{rev.title}</h4>
                  <p className="text-[#5C6662] text-xs sm:text-sm mt-1 leading-relaxed">{rev.comment}</p>
                </div>

                {/* Trail conditions pill tag */}
                {(rev.trailCondition || rev.recommendedSeason) && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {rev.trailCondition && (
                      <span className="text-[11px] bg-[#F3F1EA] text-[#2D3633] px-2 py-0.5 rounded-md border border-[#E8E4D9]">
                        Condition: <strong className="text-[#2D3633]">{rev.trailCondition}</strong>
                      </span>
                    )}
                    {rev.recommendedSeason && (
                      <span className="text-[11px] bg-[#4A6741]/10 text-[#2D4F1E] px-2 py-0.5 rounded-md border border-[#4A6741]/20">
                        Season: <strong className="text-[#1E2822]">{rev.recommendedSeason}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Helpful button */}
                <div className="pt-2 border-t border-[#E8E4D9] flex items-center justify-between text-xs text-[#8B9691]">
                  <span>Permit verified by Peak Quest guide team</span>
                  <button
                    id={`helpful-review-${rev.id}`}
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors text-xs ${
                      isHelpful
                        ? 'bg-[#4A6741]/10 text-[#2D4F1E] font-semibold border border-[#4A6741]/20'
                        : 'hover:bg-[#F3F1EA] text-[#5C6662]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({currentHelpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2822]/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#FDFCF7] rounded-2xl shadow-2xl border border-[#E8E4D9] overflow-hidden">
            <div className="bg-[#1E2822] text-[#FDFCF7] p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base font-heading">Write a Review for {trek.name}</h3>
                <p className="text-xs text-[#D1CDC0]">Share your trail insights with fellow Himalayan trekkers.</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-[#D1CDC0] hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Star rating selector */}
              <div>
                <label className="block text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-[#D1CDC0]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#2D3633] ml-2">
                    {formRating === 5 ? '5 Stars - Outstanding Expedition' : `${formRating} Stars`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C6662] mb-1">Review Headline</label>
                <input
                  id="review-headline-input"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Majestic views and great mountain food!"
                  className="w-full px-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C6662] mb-1">Detailed Experience & Tips</label>
                <textarea
                  id="review-comment-input"
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Describe trail terrain, campsite conditions, summit push, gear advice..."
                  className="w-full px-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#5C6662] mb-1">Trail Condition</label>
                  <select
                    value={formTrailCondition}
                    onChange={(e) => setFormTrailCondition(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                  >
                    <option value="Clear and well marked">Clear & dry</option>
                    <option value="Snow on summit ridge">Snow on summit ridge</option>
                    <option value="Wet & muddy trails">Wet / monsoon stream flow</option>
                    <option value="Sub-zero freeze">Sub-zero freeze</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#5C6662] mb-1">Season Trekked</label>
                  <select
                    value={formSeason}
                    onChange={(e) => setFormSeason(e.target.value as Season)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                  >
                    <option value="Autumn">Autumn (Sep - Nov)</option>
                    <option value="Winter">Winter (Dec - Feb)</option>
                    <option value="Spring">Spring (Mar - May)</option>
                    <option value="Summer">Summer (Jun - Jul)</option>
                    <option value="Monsoon">Monsoon (Jul - Aug)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#5C6662] mb-1">Your Name</label>
                  <input
                    type="text"
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 text-xs border border-[#E8E4D9] rounded-lg bg-white text-[#2D3633]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#5C6662] mb-1">City / State</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="w-full px-3 py-2 text-xs border border-[#E8E4D9] rounded-lg bg-white text-[#2D3633]"
                  />
                </div>
              </div>

              <button
                id="submit-new-review-btn"
                type="submit"
                className="w-full bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-md mt-2"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
