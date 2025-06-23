export default function EditUserForm({ user }) {
  console.log(user.email);
  return (
    <div>
      <form>
        <input type="text" value={user.email} />
      </form>
    </div>
  );
}
