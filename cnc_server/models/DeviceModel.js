�}�~ V  ���;��\wV��u
���d�|6��?�UԤ��U��m�o����+f%.���|�팩�"��x�`R���q�W�ԡ��.#Q�^*�v��_~�ds_+'ʵP;�,߯?oR�_S_��?��1BQ�7W���=��4ޠ�j���j��nn�瀊���_r�Q�/w�.Я?�U�vj���HnG���KF���dۡF6��������ֱ�)�}a֔�2�c�(uR���
B��빣�3�P��?ķE��6(� 4�e`��@��h�����Sj������Vɂ�C�IW7��,��W���\@OyA`b��z�Y�؋੕/X�-�K�SnF�0�����q�H��:an��mZt� �[����J��?�T��݆ݗz,�;q���%�U!@�nzi�+bϢ���@�-w+���|�D�ƶ��z,!��P��=Ӳ�
��>���N0e/	���G�q���w�o��8�P4]���+r�y��F�'h   // 设备名称
  location: {type: String},            // 设备位置
  department: {type: String},          // 部门
  conn: {
    ip: {type: String},
    port: {type: Number},
  },
  desc: {type: String},
};
device.getTableName = () => {
  return 'device';
};
module.exports = device;
