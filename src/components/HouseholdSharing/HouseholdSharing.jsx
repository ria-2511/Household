import { useAppDispatch, useAppSelector } from '../../store';
import { regenerateCode, removeMember } from '../../store/slices/householdSlice';
import { showToast } from '../../store/slices/uiSlice';
import './HouseholdSharing.scss';

const HouseholdSharing = () => {
  const dispatch = useAppDispatch();
  const { household, members, joinCode } = useAppSelector((state) => state.household);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const isOwner = household?.role === 'owner';

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      dispatch(showToast('Join code copied'));
    } catch {
      dispatch(showToast('Could not copy code'));
    }
  };

  const handleRegenerate = () => {
    if (!household?.id) return;
    dispatch(regenerateCode(household.id)).then((result) => {
      if (regenerateCode.fulfilled.match(result)) {
        dispatch(showToast('New join code generated'));
      }
    });
  };

  const handleRemove = (userId) => {
    if (!household?.id) return;
    dispatch(removeMember({ householdId: household.id, userId })).then((result) => {
      if (removeMember.fulfilled.match(result)) {
        dispatch(showToast('Member removed'));
      }
    });
  };

  if (!household) return null;

  return (
    <div className="household-sharing bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold mb-3 text-sm text-[var(--color-text)] border-b pb-2">Household Sharing</h3>
      <p className="text-xs text-gray-500 mb-3">{household.name}</p>

      <div className="mb-4">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Join code</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-[var(--color-bg)] border border-gray-200 rounded-xl px-4 py-3 font-mono font-bold text-lg tracking-widest text-center text-[var(--color-text)]">
            {joinCode}
          </div>
          <button type="button" onClick={copyCode} className="bg-[var(--color-primary)] text-white px-4 rounded-xl text-sm font-bold shrink-0">
            Copy
          </button>
        </div>
        {isOwner && (
          <button type="button" onClick={handleRegenerate} className="mt-2 text-xs font-bold text-[var(--color-primary)]">
            Regenerate code
          </button>
        )}
        <p className="text-[10px] text-gray-400 mt-2">Share this code so others can join your household.</p>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Members</label>
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <div key={member.userId} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: member.color }} />
                <span className="font-medium text-sm text-[var(--color-text)] truncate">{member.name}</span>
                <span className="text-[10px] text-gray-400 uppercase">{member.role}</span>
              </div>
              {isOwner && member.userId !== currentUserId && (
                <button
                  type="button"
                  onClick={() => handleRemove(member.userId)}
                  className="text-[10px] px-2 py-1 rounded-md font-bold bg-red-50 text-red-600 shrink-0"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseholdSharing;
