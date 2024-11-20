import {useSelector} from 'react-redux';

const OrderCompletePage = () => {
  const {order} = useSelector((state) => state.order);
  return (
    <>
      <div>주문번호 : {order}</div>
      <div>주문이 완료되었습니다.</div> <div>주문번호 : {order}</div>
      <div>주문이 완료되었습니다.</div> <div>주문번호 : {order}</div>
      <div>주문이 완료되었습니다.</div> <div>주문번호 : {order}</div>
      <div>주문이 완료되었습니다.</div> <div>주문번호 : {order}</div>
      <div>주문이 완료되었습니다.</div> <div>주문번호 : {order}</div>
      <div>주문이 완료되었습니다.</div> <div>주문번호 : {order}</div>
      <div>주문이 완료되었습니다.</div>
    </>
  );
};

export default OrderCompletePage;
