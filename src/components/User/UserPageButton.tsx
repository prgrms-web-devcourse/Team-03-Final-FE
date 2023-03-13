import Button from 'components/common/Button';

type UserPageButtonProps = {
  buttonText: string;
  onClick: () => void;
};

const UserPageButton = ({ buttonText, onClick }: UserPageButtonProps) => {
  return (
    <Button
      onClick={onClick}
      width='100%'
      style={{
        backgroundColor: 'white',
        border: '1px solid',
        borderColor: 'primary',
        color: 'primary',
        marginTop: '0.5rem',
        padding: '0.75rem',
      }}>
      {buttonText}
    </Button>
  );
};

export default UserPageButton;