�}~   ��4^��b���u
��-�d�&�<�?�c�Ӛ����8F��<�:b5"�tꇨ1	!����҉��+*1 &��,�/��
���c%�ʭ�Av�M��A�`�r�$f()ߣ��૾{]��������^0���� �Uc������hY��8����UTv���Ӿ�G`�hw��GP�|�#;�W�~&�+{�+�zx ek��>i���<���j�f_]�Th�� �6A�G?Nl�K��K����B9�f���"��JIKz�U~b.�S�x^��f_>�	?Q�D��X_� kׂ<:�$�m:^����=�h�/I:ȯ�C,�؋੕/X�-�K�SnF�0�����q�H��:an��mZt� �[����J��?�T��݆ݗz,�;q���%�U!@�nzi�+bϢ���@�-w+���|�D�ƶ��z,!��P��=Ӳ�
��>���N0e/	���G�q���w�o��8�P4]���+r�y��F�'hlD0Y�j��Q+R��q���, �T�����{��O��_��y���<M�JL��.�VG
��C������������L?��)���d�<g{��Sm3d��T�Ί �"Mam�-�ڏr���.)x�>b���\$�FI,/h�F�J�\Rd�w�1�p��a���@�1`Y�/�*���%�/z��|K�A�MC�.�9�/���>:u�Ʀ��u2ͱ�H8Z�<�)j/��2!�}�ҋ���X%�FD+�6Y�v�C/��B�`'�9DǾtD#:}�$����W��ǉ���s��Qe��a�Z ���d.�n��lO=Q0��s�{�.}@��/#Y������܁�X �� 6�ߜgE�2AH PV#�)#�ED�>>�-�	����{6�yewO���IG~S
��U���ȯ2��[��ڹ��>��� �z�vi��w|���5MQ�QSiSND_57��;��{zT37�݈���a�{�Q`BiB�Q�ɍ�6�M#�����F');
    close.subscribe(event => {
      pools.delete(ws);
    });

    let error =  Observable.fromEvent(ws, 'error');
    error.subscribe(event => {
      pools.delete(ws);
    });
  }

  toRender(data){
    if(_.isObject(data)){
      data = JSON.stringify(data);
    }
    pools.forEach(conn =>{
      conn.send(data);
    });
  }

}
let server = new Server();
// server.start();
module.exports =  server;
